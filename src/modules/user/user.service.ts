import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { JwtService } from '@nestjs/jwt'
import {
  FindManyOptions,
  FindOptionsSelect,
  In,
  Like,
  MoreThan,
  Not,
  Repository,
} from 'typeorm'
import { compare, hashSync } from 'bcrypt'
import { unlink } from 'fs'

import { saltRound } from 'src/core/constants'
import { ResponseMessage } from 'src/core/enums/responseMessages.enum'
import { MediaType } from 'src/core/enums/media'
import { ConversationType } from 'src/core/enums/conversation'
import { RelationWithUser, UserRoles, UserStatus } from 'src/core/enums/user'
import { AccessData } from 'src/core/types/common'
import { getBearerToken } from 'src/core/helper/getToken'
import generateResponse from 'src/core/helper/generateResponse'

import { User } from './user.entity'
import {
  CreateUserDto,
  RandomUserQueryDto,
  ResponseUser,
  UpdatePasswordDto,
  UpdateStatusManagerDto,
  UpdateUserDto,
} from './user.dto'
import Media from '../media/media.entity'
import { FriendService } from '../friend/friend.service'
import { RequestFriendService } from '../request-friend/request-friend.service'
import { SocketService } from '../socket/socket.service'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => FriendService))
    private friendService: FriendService,
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => RequestFriendService))
    private readonly requestFriendService: RequestFriendService,
    @Inject(forwardRef(() => SocketService))
    private readonly socketService: SocketService,
  ) {}

  async getByEmail(email: string) {
    return await this.userRepository.findOneBy({ email })
  }

  async addUser(createUser: CreateUserDto) {
    const user = this.userRepository.create({
      email: createUser.email,
      password: createUser.password,
    })
    const res = await this.userRepository.save(user)
    return res
  }

  async getById(id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        avatarId: true,
      },
    })
    return user
  }

  async getMe(authorization: string): Promise<ResponseUser> {
    const token = authorization.replace('Bearer ', '')
    try {
      const data = await this.jwtService.verifyAsync(token)
      const user = await this.userRepository.findOne({
        where: {
          id: data.id,
        },
        relations: {
          request_friend: {},
          avatarId: true,
          // friends: true,
        },
      }) //findOneBy({ id: data.id })

      if (!user) throw new UnauthorizedException()
      if (user.avatarId) {
        user.avatar = process.env.BE_BASE_URL + user.avatarId.cdn
      }
      return new ResponseUser(user)
    } catch (error) {
      if (error.status === 404) throw error
      throw new UnauthorizedException()
    }
  }

  async updatePassword(user: User, password: string) {
    user.password = hashSync(password, saltRound)
    return this.userRepository.save(user)
  }

  async handleUpdatePassword(authorization: string, data: UpdatePasswordDto) {
    const tokenData = await this.jwtService.verifyAsync(
      authorization.replace('Bearer ', ''),
    )
    const user = await this.userRepository.findOneBy({ id: tokenData.id })
    if (!user) throw new NotFoundException()

    const check = await compare(data.oldPass, user.password)
    if (!check)
      throw new HttpException(
        ResponseMessage.OLD_PASS_NOT_MATCH,
        HttpStatus.BAD_REQUEST,
      )

    // const password = hashSync(data.newPass, saltRound)
    await this.updatePassword(user, data.newPass)

    return {
      message: ResponseMessage.UPDATED,
    }
  }

  async getUsers(uids: string[]) {
    return await this.userRepository.findBy({
      id: In(uids),
    })
  }

  async updateUser(authorization: string, data: UpdateUserDto) {
    const tokenData: AccessData = await this.jwtService.verifyAsync(
      getBearerToken(authorization),
    )

    const user = await this.userRepository.findOneBy({
      username: data.username,
    })
    if (user)
      throw new HttpException('EXISTED_USERNANE', HttpStatus.BAD_REQUEST)

    await this.userRepository.update(
      {
        id: tokenData.id,
      },
      {
        ...data,
      },
    )

    return data
  }

  async uploadAvatar(authorization: string, avatar: Express.Multer.File) {
    const { id }: AccessData = await this.jwtService.verify(
      getBearerToken(authorization),
    )
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        avatarId: true,
        // albums: true,
      },
    })

    const media = new Media()
    // const album = new Album()
    // album.type = 'DEFAULT'
    // album.name = 'AVATAR'
    // album.medias = [media]
    // user.albums = [...user.albums, album]

    media.cdn = avatar.path.replace('public', '')
    media.type = MediaType.IMAGE

    media.user = user
    user.avatarId = media
    user.actived = true
    await this.userRepository.save(user)
    // }

    return {
      avatar: process.env.BE_BASE_URL + user.avatarId.cdn,
    }
  }

  async isExist(id: string) {
    const userCount = await this.userRepository.exist({
      where: {
        id,
      },
    })

    return userCount
  }

  async isExistByEmail(email: string) {
    return await this.userRepository.exist({
      where: {
        email,
      },
    })
  }

  async getByUsername(authorization: string, username: string) {
    const { id }: AccessData = await this.jwtService.verify(
      getBearerToken(authorization),
    )

    const user = await this.userRepository.findOne({
      where: {
        username,
        actived: true,
        status: UserStatus.ACTIVE,
      },
      relations: {
        avatarId: true,
      },
      select: {
        id: true,
        username: true,
        name: true,
        status: true,
        avatarId: {
          id: true,
          cdn: true,
        },
        sex: true,
      },
    })

    if (!user) throw new NotFoundException()

    let countFriend: number
    let countSameFriend: null | number = null
    if (user.id !== id) {
      const [relation, count, _countSameFriend] = await Promise.all([
        this.getRelation(id, user.id),
        this.friendService.count(user.id),
        this.friendService.countSameFriend(id, user.id),
      ])
      countFriend = count
      user['relation'] = relation
      countSameFriend = _countSameFriend
    } else {
      countFriend = await this.friendService.count(user.id)
    }

    user.avatarId.cdn = `${process.env.BE_BASE_URL}${user.avatarId.cdn}`

    return {
      ...user,
      countFriend,
      countSameFriend,
    }
  }

  async getRelation(id1: string, id2: string) {
    const isFriend = await this.friendService.isExist(id1, id2)
    if (isFriend) return RelationWithUser.FRIEND

    const waiting = await this.requestFriendService.getByTwoIdUser(id1, id2)
    if (waiting) {
      if (waiting.user.id === id1)
        return RelationWithUser.WAITING_ACCEPT_BY_USER

      return RelationWithUser.WAITING_ACCEPT_BY_ME
    }

    return RelationWithUser.NONE
  }

  async getByUsernameOptions(
    username: string,
    options?: {
      select?: FindOptionsSelect<User>
    },
  ) {
    const user = await this.userRepository.findOne({
      where: {
        username,
      },
      select: options?.select,
    })

    return user
  }

  async createAccount(body: CreateUserDto) {
    const isExist = await this.isExistByEmail(body.email)
    if (isExist)
      throw new HttpException(
        ResponseMessage.EXISTED_EMAIL,
        HttpStatus.BAD_REQUEST,
      )

    const user = new User()
    user.email = body.email
    user.password = hashSync(body.password, saltRound)

    await this.userRepository.save(user)
    return new ResponseUser(user)
  }

  async getUsersOption({
    options,
    includeCount,
  }: {
    options: FindManyOptions<User>
    includeCount?: true
  }) {
    if (includeCount) {
      return await this.userRepository.findAndCount(options)
    }
    return await this.userRepository.find(options)
  }

  async count(options: FindManyOptions<User>) {
    // for export
    return await this.userRepository.count(options)
  }

  async getRandomUsers({
    authorization,
    name,
    skip = 0,
    limit = 10,
    excludeRequestFriend,
  }: {
    authorization: string
  } & RandomUserQueryDto) {
    const { id }: AccessData = await this.jwtService.verifyAsync(
      getBearerToken(authorization),
    )
    const friendsId = await this.friendService.getIdsFriendOfUser(id)
    let friendsIdOfFriends: string[] = []
    if (friendsId.length) {
      friendsIdOfFriends = await this.friendService.getFriendsIdOfFriendsOfUser(
        friendsId,
      )
    }

    let userRequestId = []

    if (excludeRequestFriend) {
      const requests = await this.requestFriendService.getRequestOptions({
        options: {
          where: [
            {
              user: {
                id,
              },
            },
            {
              user_target: {
                id,
              },
            },
          ],
          relations: {
            user: true,
            user_target: true,
          },
          select: {
            id: true,
            user: {
              id: true,
            },
            user_target: {
              id: true,
            },
          },
        },
      })

      userRequestId = requests.map((request) => {
        if (request.user.id === id) return request.user_target.id
        return request.user.id
      })
    }

    const [_users, count] = await this.userRepository.findAndCount({
      where: {
        id: Not(
          In([...friendsId, ...friendsIdOfFriends, id, ...userRequestId]),
        ),
        name: name ? Like(`%${name}%`) : undefined,
        role: UserRoles.NORMAL,
        actived: true,
      },
      relations: {
        avatarId: true,
      },
      select: {
        id: true,
        name: true,
        username: true,
        avatarId: {
          id: true,
          cdn: true,
        },
      },
      take: limit,
      skip,
    })

    const users = _users.map((user) => ({
      ...user,
      avatarId: {
        ...user.avatarId,
        cdn: `${process.env.BE_BASE_URL}${user.avatarId.cdn}`,
      },
    }))

    return generateResponse(
      { users },
      {
        count,
      },
    )
  }

  async getConversations(uid: string) {
    await this.userRepository.find({
      where: {
        id: uid,
        conversations: {
          type: ConversationType.DUAL,
        },
      },
      relations: {
        conversations: true,
      },
    })
  }

  async ban(idUser: string, time: number) {
    const user = await this.userRepository.findOneBy({
      id: idUser,
    })

    if (!user) throw new NotFoundException()

    user.status = UserStatus.BANNED
    user.unBanTime = new Date(Date.now() + time * 24 * 60 * 60 * 1000)
    await this.userRepository.save(user)

    this.socketService.socket.emit(`ban-user-${idUser}`)
  }

  async getUsersStatisAdmin() {
    const time = Date.now() - 6 * 30 * 24 * 60 * 60 * 1000

    const [users, totalUser, totalBannedUser] = await Promise.all([
      this.userRepository.find({
        where: {
          role: UserRoles.NORMAL,
          createdAt: MoreThan(new Date(time)),
        },
        order: {
          createdAt: 'ASC',
        },
      }),
      this.userRepository.count({
        where: {
          role: UserRoles.NORMAL,
        },
      }),
      this.userRepository.count({
        where: {
          status: UserStatus.BANNED,
        },
      }),
    ])

    const currentMonth = new Date().getMonth() + 1

    const data = {}
    for (let i = currentMonth - 5; i <= currentMonth; i++) {
      let key
      if (i < 1) {
        key = i + 12
      } else key = i
      data[key] = {
        users: 0,
        bannedUsers: 0,
      }
    }

    users.forEach((user) => {
      const month = new Date(user.createdAt).getMonth() + 1
      data[month].users += 1

      if (user.status === UserStatus.BANNED) data[month].bannedUsers += 1
    })

    return generateResponse({
      newUsers: data,
      totalUser,
      totalBannedUser,
    })
  }

  async createManager(body: CreateUserDto) {
    const exist = await this.userRepository.exist({
      where: {
        email: body.email,
      },
    })

    if (exist) throw new BadRequestException(ResponseMessage.EXISTED_EMAIL)

    const user = new User()
    user.email = body.email
    user.password = hashSync(body.password, saltRound)
    user.role = UserRoles.MANAGER

    return await this.userRepository.save(user)
  }

  async getManagers(skip: number, limit: number, name?: string) {
    const [managers, count] = await this.userRepository.findAndCount({
      where: {
        role: UserRoles.MANAGER,
        name: name ? Like(`%${name}%`) : undefined,
        actived: true,
      },
      relations: {
        avatarId: true,
      },
      select: {
        id: true,
        name: true,
        username: true,
        avatarId: {
          id: true,
          cdn: true,
        },
        createdAt: true,
      },
      order: {
        createdAt: 'ASC',
      },
      take: limit,
      skip,
    })

    managers.forEach((manager) => {
      manager.avatarId.cdn = `${process.env.BE_BASE_URL}${manager.avatarId.cdn}`
    })

    return generateResponse(
      {
        managers,
      },
      {
        count,
      },
    )
  }

  async updateAvatar(authorization: string, avatar: Express.Multer.File) {
    const { id }: AccessData = await this.jwtService.verifyAsync(
      getBearerToken(authorization),
    )
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        avatarId: true,
      },
      select: {
        id: true,
        avatarId: {
          id: true,
          cdn: true,
        },
      },
    })

    unlink(
      __dirname.replace('dist/modules/user', 'public') + user.avatarId.cdn,
      () => {
        //
      },
    )

    user.avatarId.cdn = avatar.path.replace('public', '')
    await this.userRepository.save(user)
    return {
      message: ResponseMessage.UPDATED,
      data: {
        cdn: `${process.env.BE_BASE_URL}${user.avatarId.cdn}`,
      },
    }
  }

  async getManager(idManager: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: idManager,
      },
      relations: {
        handledReport: true,
      },
      select: {
        id: true,
        createdAt: true,
        status: true,
        handledReport: {
          id: true,
        },
      },
    })

    const manager = {
      ...user,
      totalHanledReport: user.handledReport.length,
    }
    delete manager.handledReport

    return manager
  }

  async updateManagerStatus(body: UpdateStatusManagerDto) {
    await this.userRepository.update(
      { id: body.managerId },
      {
        status: body.status,
      },
    )

    return {
      message: ResponseMessage.UPDATED,
    }
  }

  async unBan(idUser: string) {
    await this.userRepository.update(
      {
        id: idUser,
      },
      {
        status: UserStatus.ACTIVE,
        unBanTime: null,
      },
    )
  }

  async getBanned() {
    const users = await this.userRepository.find({
      where: {
        status: UserStatus.BANNED,
      },
      relations: {
        avatarId: true,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        updatedAt: true,
        createdAt: true,
        unBanTime: true,
        avatarId: {
          id: true,
          cdn: true,
        },
      },
    })

    users.forEach((user) => {
      user.avatarId.cdn = `${process.env.BE_BASE_URL}${user.avatarId.cdn}`
    })

    return generateResponse({
      users,
    })
  }

  async getListUser() {
    const users = await this.userRepository.find({
      where: {
        role: UserRoles.NORMAL,
        actived: true,
      },
      relations: {
        avatarId: true,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        createdAt: true,
        avatarId: {
          id: true,
          cdn: true,
        },
      },
    })
    users.forEach((user) => {
      user.avatarId.cdn = `${process.env.BE_BASE_URL}${user.avatarId.cdn}`
    })

    return generateResponse({
      users,
    })
  }

  async updateName(authorization: string, name: string) {
    const { id }: AccessData = await this.jwtService.verifyAsync(
      getBearerToken(authorization),
    )

    const user = await this.userRepository.findOneBy({
      id,
    })

    if (!user) throw new NotFoundException()

    user.name = name

    await this.userRepository.save(user)

    return generateResponse({
      name,
      message: ResponseMessage.UPDATED,
    })
  }
}
