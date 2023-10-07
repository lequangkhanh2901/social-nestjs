import { Injectable, NotFoundException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { TreeRepository } from 'typeorm'

import { getBearerToken } from 'src/core/helper/getToken'
import { AccessData } from 'src/core/types/common'
import { PostService } from '../post/post.service'
import Comment from './comment.entity'
import { User } from '../user/user.entity'
import { AddCommentDto } from './comment.dto'

@Injectable()
export class CommentService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly postService: PostService,
    @InjectRepository(Comment)
    private readonly commentRepository: TreeRepository<Comment>,
  ) {}

  async addComment(authorization: string, body: AddCommentDto) {
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

    comment.user = user
    comment.post = post
    comment.content = body.content
    return await this.commentRepository.save(comment)
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
      },
      order: {
        createdAt: 'DESC',
      },
    })

    comments.forEach(
      (comment) =>
        (comment.user.avatarId.cdn = `${process.env.BE_BASE_URL}${comment.user.avatarId.cdn}`),
    )

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
}
