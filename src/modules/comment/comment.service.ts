import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { FindManyOptions, TreeRepository } from 'typeorm'
import { extname } from 'path'
import { unlink } from 'fs'

import { getBearerToken } from 'src/core/helper/getToken'
import generateResponse from 'src/core/helper/generateResponse'
import { AccessData } from 'src/core/types/common'
import { MediaType, RelationType } from 'src/core/enums/media'
import { ResponseMessage } from 'src/core/enums/responseMessages.enum'
import { PostService } from '../post/post.service'
import { MediaService } from '../media/media.service'
import Comment from './comment.entity'
import { User } from '../user/user.entity'
import { AddCommentDto, UpdateCommentDto } from './comment.dto'
import Media from '../media/media.entity'
import { NotificationService } from '../notification/notification.service'

@Injectable()
export class CommentService {
  constructor(
    private readonly jwtService: JwtService,

    @Inject(forwardRef(() => PostService))
    private readonly postService: PostService,

    @InjectRepository(Comment)
    private readonly commentRepository: TreeRepository<Comment>,

    @Inject(forwardRef(() => MediaService))
    private readonly mediaService: MediaService,

    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService: NotificationService,
  ) {}

  async addComment(
    authorization: string,
    body: AddCommentDto,
    file: Express.Multer.File,
  ) {
    if (!body.content && !file) throw new BadRequestException()

    const { id }: AccessData = await this.jwtService.verify(
      getBearerToken(authorization),
    )

    const post = await this.postService.getPostById(body.id)
    if (!post) throw new NotFoundException()

    const user = new User()
    user.id = id

    const comment = new Comment()
    if (body.parentId) {
      const parentComment = new Comment()
      parentComment.id = body.parentId

      const parentComments = await this.commentRepository.findAncestors(
        parentComment,
      )

      if (parentComments.length === 0) throw new NotFoundException()

      if (parentComments.length === 3) {
        comment.parent = parentComments[1]
      } else {
        comment.parent = parentComments[parentComments.length - 1]
      }
    }
    if (file) {
      const media = new Media()
      media.cdn = file.path.replace('public', '')
      media.type =
        extname(file.filename) === '.mp4' ? MediaType.VIDEO : MediaType.IMAGE
      media.relationType = RelationType.COMMENT
      comment.media = media
    }

    comment.user = user
    comment.post = post
    comment.content = body.content

    const response = await this.commentRepository.save(comment)
    if (response.media)
      response.media.cdn = `${process.env.BE_BASE_URL}${response.media.cdn}`

    this.notificationService.commentPost(post.id, id)

    return response
  }

  async getCommentsPost(authorization: string, postId: string) {
    const { id } = await this.jwtService.verify(getBearerToken(authorization))

    const comments = await this.commentRepository.find({
      where: {
        post: {
          id: postId,
        },
      },
      relations: {
        user: {
          avatarId: true,
        },
        parent: true,
        children: true,
        likes: {
          user: true,
        },
        media: true,
      },
      select: {
        user: {
          name: true,
          username: true,
          avatarId: {
            cdn: true,
          },
        },
        parent: {
          id: true,
        },
        children: {
          id: true,
        },
        likes: {
          id: true,
          user: {
            id: true,
          },
        },
        media: {
          id: true,
          cdn: true,
          type: true,
        },
      },
      order: {
        // createdAt: 'DESC',
      },
    })

    comments.forEach((comment) => {
      comment.user.avatarId.cdn = `${process.env.BE_BASE_URL}${comment.user.avatarId.cdn}`
      if (comment.media)
        comment.media.cdn = `${process.env.BE_BASE_URL}${comment.media.cdn}`
    })

    return comments.map((comment) => {
      const comentData = {
        ...comment,
        likeData: {
          total: comment.likes.length,
          isLiked: comment.likes.some((like) => like.user.id === id),
        },
      }

      delete comentData.likes

      return comentData
    })
  }

  async deleteComment(authorization: string, idComment: number) {
    const { id }: AccessData = await this.jwtService.verify(
      getBearerToken(authorization),
    )

    const comment = await this.commentRepository.findOne({
      where: {
        id: idComment,
      },
      relations: {
        user: true,
        media: true,
      },
      select: {
        user: {
          id: true,
        },
      },
    })

    if (!comment || comment.user.id !== id) throw new NotFoundException()

    const commentsTree = await this.commentRepository.findDescendants(comment, {
      relations: ['media'],
    })

    commentsTree.forEach((cm) => {
      if (cm.media)
        unlink(
          __dirname.replace('dist/modules/comment', 'public') + cm.media.cdn,
          () => {
            //
          },
        )
    })

    await this.commentRepository.remove(comment)
    return {
      message: ResponseMessage.DELETED,
      ids: commentsTree.map((comment) => comment.id),
    }
  }

  async update(
    authorization: string,
    body: UpdateCommentDto,
    file: Express.Multer.File,
  ) {
    if (!body.content && !file) throw new BadRequestException()

    const comment = await this.commentRepository.findOne({
      where: {
        id: body.id,
      },
      relations: {
        user: true,
        media: true,
      },
      select: {
        user: {
          id: true,
        },
      },
    })
    if (!comment) throw new NotFoundException()

    const { id }: AccessData = await this.jwtService.verifyAsync(
      getBearerToken(authorization),
    )
    if (id !== comment.user.id) throw new ForbiddenException()

    if (file) {
      if (comment.media) {
        unlink(
          __dirname.replace('dist/modules/comment', 'public') +
            comment.media.cdn,
          () => {
            //
          },
        )
        comment.media.cdn = file.path.replace('public', '')
        comment.media.type =
          extname(file.filename) === '.mp4' ? MediaType.VIDEO : MediaType.IMAGE
      } else {
        const media = new Media()
        media.cdn = file.path.replace('public', '')
        media.type =
          extname(file.filename) === '.mp4' ? MediaType.VIDEO : MediaType.IMAGE
        media.user = comment.user
        comment.media = media
      }
    } else {
      if (!body.keepMedia && comment.media) {
        unlink(
          __dirname.replace('dist/modules/comment', 'public') +
            comment.media.cdn,
          () => {
            //
          },
        )
        this.mediaService.deleteMediasByIds([comment.media.id])
      }
    }
    comment.content = body.content

    await this.commentRepository.save(comment)

    if (comment.media?.cdn) {
      comment.media.cdn = `${process.env.BE_BASE_URL}${comment.media.cdn}`
    }

    return generateResponse({
      comment,
    })
  }

  async getCommentsOption({ options }: { options: FindManyOptions<Comment> }) {
    return await this.commentRepository.find(options)
  }
}
