import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare, hashSync } from 'bcrypt'

import { saltRound } from 'src/core/constants'
import { AuthTokenType, VerifyAction } from 'src/core/enums/auth'

import { UserService } from 'src/modules/user/user.service'
import { MailService } from 'src/modules/mail/mail.service'
import { LoginAuthDto, SignupAuthDto } from './auth.dto'
import { UserStatus } from 'src/core/enums/user'
import { ResponseMessage } from 'src/core/enums/responseMessages.enum'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async login(data: LoginAuthDto) {
    const user = await this.userService.getByEmail(data.email)
    if (!user) {
      throw new NotFoundException()
    }
    const isMatch = await compare(data.password, user.password)
    if (!isMatch) {
      throw new NotFoundException()
    }
    if (user.status === UserStatus.BANNED)
      throw new HttpException(
        ResponseMessage.BANNED_ACCOUT,
        HttpStatus.BAD_REQUEST,
      )

    const [refresh, access] = await Promise.all([
      this.createRefresh(user.id),
      this.createAccess(user.id, user.role),
    ])
    return { refresh, access }
  }

  async signup(data: SignupAuthDto) {
    const user = await this.userService.getByEmail(data.email)
    if (user)
      throw new HttpException(
        ResponseMessage.EXISTED_EMAIL,
        HttpStatus.BAD_REQUEST,
      )

    const token = await this.jwtService.signAsync(
      { ...data },
      {
        expiresIn: '1h',
      },
    )

    await this.mailService.sendConfirm(data.email, encodeURIComponent(token))
    return {
      message: ResponseMessage.MAIL_WAS_SENT,
    }
  }

  async verify(token: string, action: VerifyAction) {
    if (action === VerifyAction.SIGNUP) {
      try {
        const data = await this.jwtService.verifyAsync(token)
        const user = await this.userService.getByEmail(data.email)
        if (user)
          throw new HttpException(
            ResponseMessage.VERIFIED,
            HttpStatus.BAD_REQUEST,
          )
        return this.userService.addUser({
          email: data.email,
          password: hashSync(data.password, saltRound),
        })
      } catch (error) {
        if (error.name === 'JsonWebTokenError')
          throw new HttpException(
            ResponseMessage.INVALID_TOKEN,
            HttpStatus.NOT_ACCEPTABLE,
          )
        if (error.message === ResponseMessage.VERIFIED) throw error
        throw new InternalServerErrorException()
      }
    } else {
      return 'comming...'
    }
  }

  async refresh(authorization: string) {
    const token = authorization.replace('Bearer ', '')
    try {
      const data = await this.jwtService.verifyAsync(token)
      const user = await this.userService.getById(data.id)
      const [refresh, access] = await Promise.all([
        this.createRefresh(user.id),
        this.createAccess(user.id, user.role),
      ])
      return {
        refresh,
        access,
      }
    } catch (error) {
      throw new UnauthorizedException()
    }
  }

  async createRefresh(id: string) {
    return this.jwtService.signAsync(
      { id, type: AuthTokenType.REFRESH },
      { expiresIn: process.env.REFRESH_EXPIRE },
    )
  }

  async createAccess(id: string, role: string) {
    return this.jwtService.signAsync(
      { id, role, type: AuthTokenType.ACCESS },
      { expiresIn: process.env.ACCESS_EXPIRE },
    )
  }
}
