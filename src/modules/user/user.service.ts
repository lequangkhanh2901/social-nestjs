import {
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
import { FindOptionsSelect, In, Repository } from 'typeorm'
import { compare, hashSync } from 'bcrypt'

import { saltRound } from 'src/core/constants'
import { ResponseMessage } from 'src/core/enums/responseMessages.enum'
import { getBearerToken } from 'src/core/helper/getToken'
import { AccessData } from 'src/core/types/common'
import { User } from './user.entity'
import {
  CreateUserDto,
  ResponseUser,
  UpdatePasswordDto,
  UpdateUserDto,
} from './user.dto'
import { RelationWithUser, UserStatus } from 'src/core/enums/user'
import { MediaType } from 'src/core/enums/media'
import Media from '../media/media.entity'
import Album from '../album/album.entity'
import { FriendService } from '../friend/friend.service'
import { RequestFriendService } from '../request-friend/request-friend.service'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => FriendService))
    private friendService: FriendService,
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => RequestFriendService))
    private readonly requestFriendService: RequestFriendService,
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
        albums: true,
      },
    })

    const media = new Media()
    const album = new Album()
    album.type = 'DEFAULT'
    album.name = 'AVATAR'
    album.medias = [media]
    user.albums = [...user.albums, album]

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
    if (user.id !== id) {
      const [relation, count] = await Promise.all([
        this.getRelation(id, user.id),
        this.friendService.count(user.id),
      ])
      countFriend = count
      user['relation'] = relation
    } else {
      countFriend = await this.friendService.count(user.id)
    }

    user.avatarId.cdn = `${process.env.BE_BASE_URL}${user.avatarId.cdn}`

    return {
      ...user,
      countFriend,
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
}
