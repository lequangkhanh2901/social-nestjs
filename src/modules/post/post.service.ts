import { Injectable, NotFoundException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { extname } from 'path'
import { unlink } from 'fs'

import { getBearerToken } from 'src/core/helper/getToken'
import { MediaType, RelationType } from 'src/core/enums/media'
import { AccessData } from 'src/core/types/common'
import { ResponseMessage } from 'src/core/enums/responseMessages.enum'
import { User } from '../user/user.entity'
import Post from './post.entity'
import Media from '../media/media.entity'
import { FriendService } from '../friend/friend.service'
import { CreatePostDto, ResponseUserPost } from './post.dto'

@Injectable()
export class PostService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly friendService: FriendService,
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
        media.relationType = RelationType.POST

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
      },
    })
    getPost.medias.forEach(
      (media) => (media.cdn = `${process.env.BE_BASE_URL}${media.cdn}`),
    )
    return getPost
  }

  async getPostById(id: string) {
    return await this.postRepository.findOneBy({ id })
  }

  async getPosts(authorization: string, limit = 10, skip = 0) {
    const { id }: AccessData = await this.jwtService.verify(
      getBearerToken(authorization),
    )

    const friend: string[] = await this.friendService.getIdsFriendOfUser(id)

    const posts = await this.postRepository.find({
      where: [...friend, id].map((idUser) => ({
        user: {
          id: idUser,
        },
      })),
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
        totalComment: post.comments.length,
      }
      delete postData.likes
      delete postData.comments
      return postData
    })
  }

  async deletePost(authorization: string, idPost: string) {
    const { id }: AccessData = await this.jwtService.verify(
      getBearerToken(authorization),
    )

    const post = await this.postRepository.findOne({
      where: {
        id: idPost,
      },
      relations: {
        user: true,
        medias: true,
      },
      select: {
        user: {
          id: true,
        },
      },
    })

    if (!post || post.user.id !== id) throw new NotFoundException()

    post.medias.forEach((media) => {
      unlink(
        __dirname.replace('dist/modules/post', 'public') + media.cdn,
        () => {
          //
        },
      )
    })

    await this.postRepository.remove(post)

    return {
      message: ResponseMessage.DELETED,
    }
  }
}
