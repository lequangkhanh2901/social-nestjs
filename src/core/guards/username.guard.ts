import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'

@Injectable()
export default class UsernameGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    if (request.params.username.startsWith('@')) {
      request.params.username = request.params.username.replace('@', '')
      return true
    }

    return false
  }
}
