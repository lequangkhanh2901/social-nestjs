import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { JwtService } from '@nestjs/jwt'
import { Repository } from 'typeorm'

import { getBearerToken } from 'src/core/helper/getToken'
import { AccessData } from 'src/core/types/common'

import { Report } from './report.entity'
import { AddReportDto } from './report.dto'
import { User } from '../user/user.entity'
import { PostService } from '../post/post.service'
import { CommentService } from '../comment/comment.service'

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepositoty: Repository<Report>,
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => PostService))
    private readonly postService: PostService,
    @Inject(forwardRef(() => CommentService))
    private readonly commentService: CommentService,
  ) {}

  async add(authorization: string, body: AddReportDto) {
    if ((!body.postId && !body.commentId) || (body.commentId && body.postId))
      throw new BadRequestException()

    const { id }: AccessData = await this.jwtService.verifyAsync(
      getBearerToken(authorization),
    )

    if (body.postId) {
      const report = await this.reportRepositoty.exist({
        where: {
          user: {
            id,
          },
          post: {
            id: body.postId,
          },
        },
      })

      if (report) throw new HttpException('EXISTED', HttpStatus.FORBIDDEN)
    }

    if (body.commentId) {
      const report = await this.reportRepositoty.exist({
        where: {
          user: {
            id,
          },
          comment: {
            id: body.commentId,
          },
        },
      })

      if (report) throw new HttpException('EXISTED', HttpStatus.FORBIDDEN)
    }

    const report = new Report()
    report.user = { id } as User
    report.reason = body.reason
    report.note = body.note || ''
    if (body.postId) {
      const [post] = await this.postService.getPostOptions({
        options: {
          where: {
            id: body.postId,
          },
          relations: {
            user: true,
          },
          select: {
            id: true,
            user: {
              id: true,
            },
          },
          take: 1,
        },
      })

      report.userTarget = post.user
      report.post = post
    } else {
      const [comment] = await this.commentService.getCommentsOption({
        options: {
          where: {
            id: body.commentId,
          },
          relations: {
            user: true,
          },
          select: {
            id: true,
            user: {
              id: true,
            },
          },
          take: 1,
        },
      })
      report.comment = comment
      report.userTarget = comment.user
    }

    return await this.reportRepositoty.save(report)
  }
}
