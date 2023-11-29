import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
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
import generateKey from 'src/core/helper/generateKey'

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    private readonly jwtService: JwtService,

    @Inject(forwardRef(() => MailService))
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
    if (user.status === UserStatus.BANNED) {
      if (new Date(user.unBanTime).getTime() > Date.now()) {
        throw new HttpException(
          {
            message: ResponseMessage.BANNED_ACCOUT,
            openAt: user.unBanTime,
          },
          HttpStatus.BAD_REQUEST,
        )
      }

      await this.userService.unBan(user.id)
    }

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
      { ...data, type: VerifyAction.SIGNUP },
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
        if (data.type !== VerifyAction.SIGNUP)
          throw new HttpException(
            ResponseMessage.INVALID_ACTION,
            HttpStatus.BAD_REQUEST,
          )
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
        if (
          error.message === ResponseMessage.VERIFIED ||
          error.message === ResponseMessage.INVALID_ACTION
        )
          throw error
        throw new InternalServerErrorException()
      }
    } else if (action === VerifyAction.FORGOT_PASSWORD) {
      try {
        const data = await this.jwtService.verifyAsync(token)
        if (data.type !== VerifyAction.FORGOT_PASSWORD)
          throw new HttpException(
            ResponseMessage.INVALID_ACTION,
            HttpStatus.BAD_REQUEST,
          )

        const user = await this.userService.getByEmail(data.email)
        if (!user)
          throw new HttpException(
            ResponseMessage.EMAIL_NOT_EXIST,
            HttpStatus.NOT_FOUND,
          )

        if (user.status === UserStatus.BANNED)
          throw new HttpException(
            ResponseMessage.BANNED_ACCOUT,
            HttpStatus.BAD_REQUEST,
          )

        const key = generateKey(10)
        await this.userService.updatePassword(user, key)
        return {
          key: key,
        }
      } catch (error) {
        if (error.name === 'JsonWebTokenError')
          throw new HttpException(
            ResponseMessage.INVALID_TOKEN,
            HttpStatus.NOT_ACCEPTABLE,
          )

        throw error
      }
    } else {
      throw new HttpException(
        ResponseMessage.INVALID_ACTION,
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  async refresh(authorization: string) {
    const token = authorization.replace('Bearer ', '')
    try {
      const data = await this.jwtService.verifyAsync(token)
      const user = await this.userService.getById(data.id)
      if (user.status === UserStatus.BANNED)
        throw new ForbiddenException(ResponseMessage.BANNED_ACCOUT)
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

  async forgotPassword(email: string) {
    const user = await this.userService.getByEmail(email)
    if (!user) throw new NotFoundException()

    if (user.status === UserStatus.BANNED)
      throw new ForbiddenException(ResponseMessage.BANNED_ACCOUT)

    const token = await this.jwtService.signAsync(
      { email, type: VerifyAction.FORGOT_PASSWORD },
      {
        expiresIn: process.env.EMAIL_TOKEN_EXPIRE,
      },
    )
    await this.mailService.sendConfirm(email, token, 'forgot_password')
    return {
      message: ResponseMessage.MAIL_WAS_SENT,
    }
  }
}
