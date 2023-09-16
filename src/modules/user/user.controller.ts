import { Body, Controller, Get, Headers, Put, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from 'src/core/guards/auth.guard'
import { UserService } from './user.service'
import { UpdatePasswordDto } from './user.dto'

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post()
  // addUser(@Body() createUser: CreateUserDto) {
  //   return this.userService.addUser(createUser)
  // }

  @Get()
  getMe(@Headers() headers) {
    return this.userService.getMe(headers.authorization)
  }

  @Put('password')
  updatePassword(@Headers() headers, @Body() body: UpdatePasswordDto) {
    return this.userService.handleUpdatePassword(headers.authorization, body)
  }
}
