import { Body, Controller, Get, Headers, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from 'src/core/guards/auth.guard'
import { CreateUserDto } from './user.dto'
import { UserService } from './user.service'

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  addUser(@Body() createUser: CreateUserDto) {
    return this.userService.addUser(createUser)
  }

  @Get()
  getMe(@Headers() headers) {
    return this.userService.getMe(headers.authorization)
  }
}
