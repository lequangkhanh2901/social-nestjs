import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { JwtService } from '@nestjs/jwt'
import { In, Repository } from 'typeorm'
import { compare, hashSync } from 'bcrypt'

import { User } from './user.entity'
import { CreateUserDto, ResponseUser, UpdatePasswordDto } from './user.dto'
import { saltRound } from 'src/core/constants'
import { ResponseMessage } from 'src/core/enums/responseMessages.enum'
import RequestFriend from '../request-friend/request-friend.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(RequestFriend)
    private readonly requestFriendRepository: Repository<RequestFriend>,

    private readonly jwtService: JwtService,
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
    const user = await this.userRepository.findOneBy({ id })
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
          // friends: true,
        },
      }) //findOneBy({ id: data.id })

      if (!user) throw new NotFoundException()
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
}
