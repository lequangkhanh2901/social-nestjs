import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'

import { UserRoles } from '../enums/user'
import { ROLES_KEY } from '../decorators/roles.decorator'
import { getBearerToken } from '../helper/getToken'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    )
    if (!requiredRoles) {
      return true
    }
    const request = context.switchToHttp().getRequest()
    try {
      const data = await this.jwtService.verifyAsync(
        getBearerToken(request.headers.authorization),
      )
      if (!data.role) throw new UnauthorizedException()
      return requiredRoles.some((role) => role === data.role)
    } catch (error) {
      throw new UnauthorizedException()
    }
  }
}
