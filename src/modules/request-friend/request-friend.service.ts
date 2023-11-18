import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { getBearerToken } from 'src/core/helper/getToken'
import { ResponseMessage } from 'src/core/enums/responseMessages.enum'
import { AccessData } from 'src/core/types/common'

import { FriendService } from '../friend/friend.service'
import { UserService } from '../user/user.service'
import { User } from '../user/user.entity'
import RequestFriend from './request-friend.entity'
import { NotificationService } from '../notification/notification.service'

@Injectable()
export class RequestFriendService {
  constructor(
    @InjectRepository(RequestFriend)
    private readonly requestFriendRepository: Repository<RequestFriend>,
    private readonly jwtService: JwtService,

    @Inject(forwardRef(() => FriendService))
    private readonly friendService: FriendService,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService: NotificationService,
  ) {}

  async request(token: string, uid: string) {
    const data = await this.jwtService.verify(getBearerToken(token))

    if (data.id === uid) throw new BadRequestException()

    const isExist = await this.userService.isExist(uid)
    if (!isExist) throw new NotFoundException()

    const isExistRequest = await this.requestFriendRepository.exist({
      where: [
        {
          user: {
            id: data.id,
          },
          user_target: {
            id: uid,
          },
        },
        {
          user: {
            id: uid,
          },
          user_target: {
            id: data.id,
          },
        },
      ],
    })
    if (isExistRequest) throw new BadRequestException()

    const friend = await this.friendService.getFriend(data.id, uid)
    if (friend)
      throw new HttpException(
        ResponseMessage.ALREADY_FRIEND,
        HttpStatus.BAD_REQUEST,
      )

    const request = new RequestFriend()
    const user = new User()
    const targetUser = new User()

    user.id = data.id
    targetUser.id = uid
    request.user = user
    request.user_target = targetUser

    const response = await this.requestFriendRepository.save(request)
    this.notificationService.newRequestFriend(uid, data.id)
    return response
  }

  async received(authorization: string) {
    const { id }: AccessData = await this.jwtService.verify(
      getBearerToken(authorization),
    )

    const requests = await this.requestFriendRepository.find({
      where: {
        user_target: {
          id,
        },
      },
      relations: {
        user: {
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
      },
    })

    return requests.map((request) => ({
      ...request,
      user: {
        ...request.user,
        avatarId: {
          ...request.user.avatarId,
          cdn: `${process.env.BE_BASE_URL}${request.user.avatarId.cdn}`,
        },
      },
    }))
  }

  async sent(authorization: string) {
    const { id }: AccessData = await this.jwtService.verify(
      getBearerToken(authorization),
    )

    const [requests, count] = await this.requestFriendRepository.findAndCount({
      where: {
        user: {
          id,
        },
      },
      relations: {
        user_target: {
          avatarId: true,
        },
      },
      select: {
        user_target: {
          id: true,
          name: true,
          username: true,
          avatarId: {
            id: true,
            cdn: true,
          },
        },
      },
    })

    return {
      meta: {
        total: count,
      },
      requests: requests.map((request) => ({
        ...request,
        user_target: {
          ...request.user_target,
          avatarId: {
            ...request.user_target.avatarId,
            cdn: `${process.env.BE_BASE_URL}${request.user_target.avatarId.cdn}`,
          },
        },
      })),
    }
  }

  async accept(authorization: string, userId: string) {
    const { id }: AccessData = await this.jwtService.verify(
      getBearerToken(authorization),
    )

    const request = await this.requestFriendRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        user_target: {
          id: id,
        },
      },
      relations: {
        user: true,
        user_target: true,
      },
      select: {
        user: {
          id: true,
        },
        user_target: {
          id: true,
        },
      },
    })
    if (!request) throw new NotFoundException()

    await Promise.all([
      this.friendService.add(request.user.id, request.user_target.id),
      this.requestFriendRepository.remove(request),
    ])

    this.notificationService.acceptedRequestFriend(userId, id)

    return {
      message: ResponseMessage.ACCEPTED,
    }
  }

  async reject(authorization: string, idRequest: string) {
    const { id }: AccessData = await this.jwtService.verify(
      getBearerToken(authorization),
    )

    const request = await this.requestFriendRepository.findOne({
      where: {
        id: idRequest,
      },
      relations: {
        user_target: true,
      },
      select: {
        user_target: {
          id: true,
        },
      },
    })

    if (!request || request.user_target.id !== id) throw new NotFoundException()

    await this.requestFriendRepository.remove(request)
    return {
      message: ResponseMessage.REJECTED,
    }
  }

  async cancel(authorization: string, idUser: string) {
    const { id }: AccessData = await this.jwtService.verify(
      getBearerToken(authorization),
    )

    await this.requestFriendRepository.delete({
      user: { id: id },
      user_target: {
        id: idUser,
      },
    })
    return {
      message: ResponseMessage.CANCELED,
    }
  }

  async getByTwoIdUser(id1: string, id2: string) {
    const request = await this.requestFriendRepository.findOne({
      where: [
        {
          user: {
            id: id1,
          },
          user_target: {
            id: id2,
          },
        },
        {
          user: {
            id: id2,
          },
          user_target: {
            id: id1,
          },
        },
      ],
      relations: {
        user: true,
        user_target: true,
      },
      select: {
        user: {
          id: true,
        },
        user_target: {
          id: true,
        },
      },
    })

    return request
  }
}
