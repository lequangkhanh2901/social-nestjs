import { Injectable, NotFoundException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Not,
  Repository,
} from 'typeorm'
import { extname } from 'path'
import { unlink } from 'fs'

import { getBearerToken } from 'src/core/helper/getToken'
import { MediaType, RelationType } from 'src/core/enums/media'
import { AccessData } from 'src/core/types/common'
import { ResponseMessage } from 'src/core/enums/responseMessages.enum'
import { RelationWithUser } from 'src/core/enums/user'
import { PostType } from 'src/core/enums/post'

import { User } from '../user/user.entity'
import Post from './post.entity'
import Media from '../media/media.entity'
import { FriendService } from '../friend/friend.service'
import { CreatePostDto, ResponseUserPost } from './post.dto'
import { UserService } from '../user/user.service'

@Injectable()
export class PostService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly friendService: FriendService,
    private readonly userService: UserService,
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

    const [posts, count] = await this.postRepository.findAndCount({
      where: [...friend, id].map((idUser) => ({
        user: {
          id: idUser,
        },
        type: Not(PostType.PRIVATE),
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

    return {
      meta: {
        total: count,
      },
      posts: posts.map((post) => {
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
      }),
    }
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
        comments: {
          media: true,
        },
      },
      select: {
        user: {
          id: true,
        },
        comments: {
          id: true,
          media: {
            id: true,
            cdn: true,
          },
          // media: true
        },
      },
    })

    if (!post || post.user.id !== id) throw new NotFoundException()

    const medias: (Media | null)[] = [
      ...post.medias,
      ...post.comments.map((comment) => comment.media),
    ]

    medias.forEach((media) => {
      if (media) {
        unlink(
          __dirname.replace('dist/modules/post', 'public') + media.cdn,
          () => {
            //
          },
        )
      }
    })

    await this.postRepository.remove(post)

    return {
      message: ResponseMessage.DELETED,
    }
  }

  async getPostsByUsername(
    authorization: string,
    username: string,
    limit = 10,
    skip = 0,
  ) {
    const { id }: AccessData = await this.jwtService.verify(
      getBearerToken(authorization),
    )

    const user = await this.userService.getByUsernameOptions(username, {
      select: {
        id: true,
      },
    })

    if (!user) throw new NotFoundException()

    let posts: Post[]

    const relations: FindOptionsRelations<Post> = {
      medias: true,
      comments: true,
      likes: {
        user: true,
      },
      user: {
        avatarId: true,
      },
    }
    const select: FindOptionsSelect<Post> = {
      comments: {
        id: true,
      },
      likes: {
        id: true,
        user: {
          id: true,
        },
      },
      user: {
        id: true,
        name: true,
      },
    }

    const meta = {
      total: 0,
    }

    if (id === user.id) {
      const data = await this.postRepository.findAndCount({
        where: {
          user: {
            id,
          },
        },
        relations: relations,
        select: select,
        skip,
        take: limit,
        order: {
          createdAt: 'DESC',
        },
      })

      posts = data[0]
      meta.total = data[1]
    } else {
      const relation = await this.userService.getRelation(user.id, id)

      let whereOptions: FindOptionsWhere<Post>[] | FindOptionsWhere<Post>
      if (relation === RelationWithUser.FRIEND) {
        whereOptions = [
          {
            user: {
              id: user.id,
            },
            type: PostType.PUBLIC,
          },
          {
            user: {
              id: user.id,
            },
            type: PostType.ONLY_FRIEND,
          },
        ]
      } else {
        whereOptions = {
          user: {
            id: user.id,
          },
          type: PostType.PUBLIC,
        }
      }

      const data = await this.postRepository.findAndCount({
        where: whereOptions,
        relations: relations,
        select: select,
        skip,
        take: limit,
        order: {
          createdAt: 'DESC',
        },
      })

      posts = data[0]
      meta.total = data[1]
    }

    return {
      meta,
      posts: posts.map((post) => {
        const _post = {
          ...post,
          user: {
            ...post.user,
            avatarId: {
              ...post.user.avatarId,
              cdn: `${process.env.BE_BASE_URL}${post.user.avatarId.cdn}`,
            },
          },

          likeData: {
            total: post.likes.length,
            isLiked: post.likes.some((like) => like.user.id === id),
          },
          totalComment: post.comments.length,
        }
        _post.medias.forEach(
          (media) => (media.cdn = `${process.env.BE_BASE_URL}${media.cdn}`),
        )

        delete _post.likes
        delete _post.comments

        return _post
      }),
    }
  }
}
