import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { LikeType } from 'src/core/enums/common'
import { getBearerToken } from 'src/core/helper/getToken'
import Like from './like.entity'
import { Repository } from 'typeorm'
import { User } from '../user/user.entity'
import Post from '../post/post.entity'
import { ResponseMessage } from 'src/core/enums/responseMessages.enum'
import Comment from '../comment/comment.entity'

@Injectable()
export class LikeService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
  ) {}

  async like(authorization: string, id: string | number, type: LikeType) {
    const { id: idUser } = await this.jwtService.verifyAsync(
      getBearerToken(authorization),
    )
    if (type === LikeType.POST) {
      return this.likePost(idUser, id as string)
    } else {
      return this.likeComment(idUser, id)
    }
  }

  async likePost(idUser: string, idPost: string) {
    const user = new User()
    user.id = idUser
    const post = new Post()
    post.id = idPost
    const like = await this.likeRepository.findOneBy({
      user,
      post,
    })

    if (like) {
      await this.likeRepository.delete(like.id)
      return {
        message: ResponseMessage.UNLIKED,
      }
    } else {
      const like = new Like()
      like.user = user
      like.post = post

      await this.likeRepository.save(like)
      return {
        message: ResponseMessage.LIKED,
      }
    }
  }

  async likeComment(idUser: string, idComment: string | number) {
    const liked = await this.likeRepository.findOne({
      where: {
        user: {
          id: idUser,
        },
        comment: {
          id: idComment as number,
        },
      },
    })

    if (liked) {
      await this.likeRepository.remove(liked)
      return {
        message: ResponseMessage.UNLIKED,
      }
    }

    const user = new User()
    user.id = idUser

    const comment = new Comment()
    comment.id = idComment as number

    const like = new Like()
    like.user = user
    like.comment = comment

    await this.likeRepository.save(like)
    return {
      message: ResponseMessage.LIKED,
    }
  }
}
