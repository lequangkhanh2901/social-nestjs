import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import {
  FindManyOptions,
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
import {
  CreatePostDto,
  ResponseUserPost,
  SharePostDto,
  UpdatePostDto,
  UpdateSharedPostDto,
} from './post.dto'
import { UserService } from '../user/user.service'
import { MediaService } from '../media/media.service'
import { NotificationService } from '../notification/notification.service'

@Injectable()
export class PostService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @Inject(forwardRef(() => FriendService))
    private readonly friendService: FriendService,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    @Inject(forwardRef(() => MediaService))
    private readonly mediaService: MediaService,

    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService: NotificationService,
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
    if (
      body.type === PostType.CUSTOM_EXCLUDE ||
      body.type === PostType.CUSTOM_ONLY
    ) {
      post.userIds = body.userIds
    }
    const listMedia =
      medias?.map((file) => {
        const media = new Media()
        media.cdn = file.path.replace('public', '')
        media.user = user
        media.type =
          extname(file.filename) === '.mp4' ? MediaType.VIDEO : MediaType.IMAGE
        media.relationType = RelationType.POST

        return media
      }) || []
    post.medias = listMedia
    const data = await this.postRepository.save(post)
    if (body.type !== PostType.PRIVATE) {
      this.notificationService.newPostFromFriend(
        id,
        post.id,
        post.type,
        post.userIds,
      )
    }
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
        // type: Not(PostType.PRIVATE),
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
        originPost: {
          user: {
            id: true,
            name: true,
            username: true,
            avatarId: {
              id: true,
              cdn: true,
            },
          },
          id: true,
          content: true,
          medias: {
            id: true,
            cdn: true,
            type: true,
          },
          createdAt: true,
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
        originPost: {
          user: {
            avatarId: true,
          },
          medias: true,
        },
      },
    })

    posts.forEach((post, index) => {
      if (post.user.id !== id) {
        if (post.type === PostType.PRIVATE) {
          posts[index] = null
          return
        }

        if (
          (post.type === PostType.CUSTOM_EXCLUDE &&
            post.userIds.includes(id)) ||
          (post.type === PostType.CUSTOM_ONLY && !post.userIds.includes(id))
        ) {
          posts[index] = null
          return
        }
      }

      post.medias.forEach(
        (media) => (media.cdn = process.env.BE_BASE_URL + media.cdn),
      )
      post.user = new ResponseUserPost(post.user) as typeof post.user
      post.user.avatarId.cdn = process.env.BE_BASE_URL + post.user.avatarId.cdn

      if (post.originPost) {
        post.originPost.medias.forEach((media) => {
          media.cdn = `${process.env.BE_BASE_URL}${media.cdn}`
        })
        post.originPost.user.avatarId.cdn = `${process.env.BE_BASE_URL}${post.originPost.user.avatarId.cdn}`
      }
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

  async getPost(authorization: string, postId: string) {
    const [post] = await this.postRepository.find({
      where: {
        id: postId,
      },
      relations: {
        originPost: {
          user: {
            avatarId: true,
          },
          medias: true,
        },
        user: {
          avatarId: true,
        },
        likes: {
          user: true,
        },
        comments: true,
        medias: true,
      },
      select: {
        user: {
          id: true,
          name: true,
          username: true,
          avatarId: {
            id: true,
            cdn: true,
          },
        },
        likes: {
          id: true,
          user: {
            id: true,
          },
        },
        comments: {
          id: true,
        },
        medias: {
          id: true,
          cdn: true,
          type: true,
        },
        originPost: {
          id: true,
          content: true,
          createdAt: true,
          user: {
            id: true,
            name: true,
            username: true,
            avatarId: {
              id: true,
              cdn: true,
            },
          },
          medias: {
            id: true,
            cdn: true,
            type: true,
          },
        },
      },
    })

    if (!post) throw new NotFoundException()
    const { id }: AccessData = await this.jwtService.verifyAsync(
      getBearerToken(authorization),
    )

    if (post.type !== PostType.PUBLIC && id !== post.user.id) {
      if (post.type === PostType.PRIVATE) throw new NotFoundException()
      const relation = await this.userService.getRelation(id, post.user.id)
      if (post.type === PostType.ONLY_FRIEND) {
        if (relation !== RelationWithUser.FRIEND) throw new NotFoundException()
      }
    }

    post.user.avatarId.cdn = `${process.env.BE_BASE_URL}${post.user.avatarId.cdn}`

    post.medias.forEach((media) => {
      media.cdn = `${process.env.BE_BASE_URL}${media.cdn}`
    })

    if (post.originPost) {
      post.originPost.user.avatarId.cdn = `${process.env.BE_BASE_URL}${post.originPost.user.avatarId.cdn}`
      post.originPost.medias.forEach((media) => {
        media.cdn = `${process.env.BE_BASE_URL}${media.cdn}`
      })
    }

    post['likeData'] = {
      total: post.likes.length,
      isLiked: post.likes.some((like) => like.user.id === id),
    }
    post['totalComment'] = post.comments.length
    delete post.likes
    delete post.comments
    return post
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
        whereOptions = {
          user: {
            id: user.id,
          },
          type: Not(PostType.PRIVATE),
        }
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

  async updatePost(
    authorization: string,
    data: UpdatePostDto,
    medias?: Express.Multer.File[],
  ) {
    const post = await this.postRepository.findOne({
      where: {
        id: data.id,
      },
      relations: {
        medias: true,
        user: true,
      },
      select: {
        user: {
          id: true,
        },
      },
    })

    if (!post) throw new NotFoundException()

    const { id }: AccessData = await this.jwtService.verify(
      getBearerToken(authorization),
    )
    if (id !== post.user.id) throw new NotFoundException()

    if (!data.keepMedia) {
      post.medias.length &&
        this.mediaService.deleteMediasByIds(
          post.medias.map((media) => media.id),
        )
      post.medias.forEach((media) => {
        unlink(
          __dirname.replace('dist/modules/post', 'public') + media.cdn,
          () => {
            //
          },
        )
      })
      post.medias = []
    } else {
      const removedMediaIds: string[] = []
      const removedMediaCdns: string[] = []
      post.medias.forEach((media) => {
        if (!data.keepMedia.includes(media.id)) {
          removedMediaIds.push(media.id)
          removedMediaCdns.push(media.cdn)
        }
      })
      post.medias = post.medias.filter(
        (media) => !removedMediaIds.includes(media.id),
      )

      removedMediaIds.length &&
        this.mediaService.deleteMediasByIds(removedMediaIds)
      removedMediaCdns.forEach((link) => {
        unlink(__dirname.replace('dist/modules/post', 'public') + link, () => {
          //
        })
      })
    }

    if (medias) {
      const user = new User()
      user.id = id

      medias.forEach((file) => {
        const media = new Media()
        media.cdn = file.path.replace('public', '')
        media.user = user
        media.type =
          extname(file.filename) === '.mp4' ? MediaType.VIDEO : MediaType.IMAGE
        media.relationType = RelationType.POST

        post.medias.push(media)
      })
    }

    post.content = data.content
    post.type = data.type

    await this.postRepository.save(post)

    post.medias.forEach((media) => {
      media.cdn = `${process.env.BE_BASE_URL}${media.cdn}`
    })
    return post
  }

  async sharePost(authorization: string, body: SharePostDto) {
    const _post = await this.postRepository.findOne({
      where: {
        id: body.originPostId,
      },
      relations: {
        originPost: true,
      },
      select: {
        originPost: {
          id: true,
        },
      },
    })

    if (!_post) throw new NotFoundException()

    const { id }: AccessData = await this.jwtService.verifyAsync(
      getBearerToken(authorization),
    )

    let originPost: Post
    if (_post.isOrigin) {
      originPost = _post
    } else {
      originPost = _post.originPost
    }

    const post = new Post()
    post.user = { id } as User

    post.content = body.content
    post.originPost = originPost

    post.isOrigin = false

    await this.postRepository.save(post)
    return post
  }

  async updateSharedPost(authorization: string, body: UpdateSharedPostDto) {
    const post = await this.postRepository.findOne({
      where: {
        id: body.postId,
      },
      relations: {
        user: true,
      },
      select: {
        user: {
          id: true,
        },
      },
    })

    if (!post) throw new NotFoundException()

    const { id }: AccessData = await this.jwtService.verifyAsync(
      getBearerToken(authorization),
    )
    if (id !== post.user.id) throw new ForbiddenException()

    post.content = body.content || ''
    return await this.postRepository.save(post)
  }

  async getPostOptions({ options }: { options: FindManyOptions<Post> }) {
    //export
    return await this.postRepository.find(options)
  }
}
