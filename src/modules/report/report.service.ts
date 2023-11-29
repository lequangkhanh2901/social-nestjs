import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { JwtService } from '@nestjs/jwt'
import { Repository } from 'typeorm'

import { getBearerToken } from 'src/core/helper/getToken'
import generateResponse from 'src/core/helper/generateResponse'
import { AccessData } from 'src/core/types/common'
import { AcceptAction, ResolveStatus } from 'src/core/enums/report'
import { ResponseMessage } from 'src/core/enums/responseMessages.enum'

import { Report } from './report.entity'
import { AddReportDto } from './report.dto'
import { User } from '../user/user.entity'
import { PostService } from '../post/post.service'
import { CommentService } from '../comment/comment.service'
import { UserService } from '../user/user.service'

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
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
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
      report.type = 'POST'
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
      report.type = 'COMMENT'
    }

    return await this.reportRepositoty.save(report)
  }

  async get(limit: number, skip: number) {
    const [reports, count] = await this.reportRepositoty.findAndCount({
      where: {
        handled: false,
      },
      relations: {
        post: {
          medias: true,
          originPost: {
            user: {
              avatarId: true,
            },
            medias: true,
          },
        },
        comment: {
          media: true,
        },
        userTarget: {
          avatarId: true,
        },
        user: {
          avatarId: true,
        },
      },
      select: {
        post: {
          id: true,
          content: true,
          createdAt: true,
          isOrigin: true,
          medias: {
            id: true,
            cdn: true,
            type: true,
          },
          originPost: {
            id: true,
            content: true,
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
            },
            createdAt: true,
          },
        },
        comment: {
          id: true,
          content: true,
          createdAt: true,
          media: {
            id: true,
            cdn: true,
            type: true,
          },
        },
        userTarget: {
          id: true,
          name: true,
          username: true,
          avatarId: {
            id: true,
            cdn: true,
          },
        },
        user: {
          id: true,
          name: true,
          username: true,
          avatarId: {
            id: true,
            cdn: true,
          },
        },
      },
      order: {
        createdAt: 'DESC',
      },
      take: limit,
      skip,
    })

    reports.forEach((report) => {
      report.user.avatarId.cdn = `${process.env.BE_BASE_URL}${report.user.avatarId.cdn}`
      report.userTarget.avatarId.cdn = `${process.env.BE_BASE_URL}${report.userTarget.avatarId.cdn}`
      if (report.post) {
        report.post.medias.forEach((media) => {
          media.cdn = `${process.env.BE_BASE_URL}${media.cdn}`
        })
      }
      if (report.comment?.media) {
        report.comment.media.cdn = `${process.env.BE_BASE_URL}${report.comment.media.cdn}`
      }
    })

    return generateResponse(
      {
        reports,
      },
      {
        count,
      },
    )
  }

  async reject(authorization: string, reportId: string) {
    const report = await this.reportRepositoty.findOneBy({
      id: reportId,
    })

    if (!report) throw new NotFoundException()
    if (report.handled) throw new ForbiddenException()

    const { id }: AccessData = await this.jwtService.verifyAsync(
      getBearerToken(authorization),
    )

    report.handled = true
    report.status = ResolveStatus.REJECTED
    report.manager = { id } as User
    return await this.reportRepositoty.save(report)
  }

  async accept(
    authorization: string,
    reportId: string,
    actions: AcceptAction[],
    time?: number,
  ) {
    if (
      actions.length === 0 ||
      (actions.includes(AcceptAction.BAN_USER) && !time)
    )
      throw new BadRequestException()

    const report = await this.reportRepositoty.findOne({
      where: {
        id: reportId,
      },
      relations: {
        post: true,
        comment: true,
        userTarget: true,
      },
      select: {
        id: true,
        handled: true,
        post: {
          id: true,
        },
        comment: {
          id: true,
        },
        userTarget: {
          id: true,
        },
      },
    })

    if (!report) throw new NotFoundException()
    if (report.handled) throw new ForbiddenException()

    const { id }: AccessData = await this.jwtService.verifyAsync(
      getBearerToken(authorization),
    )

    report.handled = true
    report.status = ResolveStatus.ACCEPTED
    report.manager = { id } as User
    report.actions = actions

    await this.reportRepositoty.save(report)

    if (actions.includes(AcceptAction.DELETE_ORIGIN)) {
      if (report.post)
        await this.postService.deletePost(authorization, report.post.id)
      else
        await this.commentService.deleteComment(
          authorization,
          report.comment.id,
        )
    }

    if (actions.includes(AcceptAction.BAN_USER))
      await this.userService.ban(report.userTarget.id, time)

    if (actions.includes(AcceptAction.WARN_USER)) {
      // todo
    }

    return ResponseMessage.HANDLED
  }

  async getHandled(authorization: string, skip: number, limit: number) {
    const { id }: AccessData = await this.jwtService.verifyAsync(
      getBearerToken(authorization),
    )

    const [reports, count] = await this.reportRepositoty.findAndCount({
      where: {
        handled: true,
        manager: {
          id,
        },
      },
      relations: {
        user: {
          avatarId: true,
        },
        userTarget: {
          avatarId: true,
        },
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
        userTarget: {
          id: true,
          name: true,
          username: true,
          avatarId: {
            id: true,
            cdn: true,
          },
        },
      },
      take: limit,
      skip,
      order: {
        updatedAt: 'DESC',
      },
    })

    reports.forEach((report) => {
      report.user.avatarId.cdn = `${process.env.BE_BASE_URL}${report.user.avatarId.cdn}`
      report.userTarget.avatarId.cdn = `${process.env.BE_BASE_URL}${report.userTarget.avatarId.cdn}`
    })

    return generateResponse(
      {
        reports,
      },
      {
        count,
      },
    )
  }
}
