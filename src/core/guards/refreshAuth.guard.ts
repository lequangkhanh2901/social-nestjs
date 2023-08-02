import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthTokenType } from '../enums/auth'

@Injectable()
export class RefreshAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    return this.validateRequest(request.headers)
  }

  async validateRequest(headers: any) {
    if (!headers.authorization || !headers.authorization.startsWith('Bearer '))
      throw new UnauthorizedException()

    try {
      const data = await this.jwtService.verifyAsync(
        this.getToken(headers.authorization),
      )
      if (!data.type || data.type !== AuthTokenType.REFRESH)
        throw new UnauthorizedException()
    } catch (error) {
      throw new UnauthorizedException()
    }
    return true
  }

  getToken(authorization: string) {
    const token = authorization.replace('Bearer ', '')
    return token
  }
}
