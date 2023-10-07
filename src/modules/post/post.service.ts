import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { extname } from 'path'

import { getBearerToken } from 'src/core/helper/getToken'
import { MediaType } from 'src/core/enums/media'
import { User } from '../user/user.entity'
import Post from './post.entity'
import Media from '../media/media.entity'
import { CreatePostDto, ResponseUserPost } from './post.dto'

@Injectable()
export class PostService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async createPost(
    authorization: string,
    body: CreatePostDto,
    medias?: Express.Multer.File[],
  ) {
    const { id } = await this.jwtService.verify(getBearerToken(authorization))
    const user = new User()
    user.id = id
    const post = new Post()
    post.user = user
    post.content = body.content || ''
    post.type = body.type
    const listMedia =
      medias?.map((file) => {
        const media = new Media()
        media.cdn = file.path.replace('public', '')
        media.user = user
        extname(file.filename)
        media.type =
          extname(file.filename) === '.mp4' ? MediaType.VIDEO : MediaType.IMAGE

        return media
      }) || []
    post.medias = listMedia
    const data = await this.postRepository.save(post)
    const getPost = await this.postRepository.findOne({
      where: {
        id: data.id,
      },
      relations: {
        medias: true,
        user: true,
      },
    })
    return getPost
  }

  async getPostById(id: string) {
    return await this.postRepository.findOneBy({ id })
  }

  async getPosts(authorization: string, limit = 10, skip = 0) {
    const { id } = await this.jwtService.verify(getBearerToken(authorization))

    const user = new User()
    user.id = id
    const posts = await this.postRepository.find({
      where: {
        user: user,
      },
      skip,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
      select: {
        likes: {
          id: true,
          user: {
            id: true,
          },
        },
        comments: {
          id: true,
        },
      },
      relations: {
        medias: true,
        user: {
          avatarId: true,
        },
        likes: {
          user: true,
        },
        comments: true,
      },
    })

    posts.forEach((post) => {
      post.medias.forEach(
        (media) => (media.cdn = process.env.BE_BASE_URL + media.cdn),
      )
      post.user = new ResponseUserPost(post.user) as typeof post.user
      post.user.avatarId.cdn = process.env.BE_BASE_URL + post.user.avatarId.cdn
    })

    return posts.map((post) => {
      const postData = {
        ...post,
        likeData: {
          total: post.likes.length,
          isLiked: post.likes.some((like) => like.user.id === id),
        },
      }
      delete postData.likes
      return postData
    })
  }
}
