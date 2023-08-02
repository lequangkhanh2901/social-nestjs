import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Param,
  ParseEnumPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger'

import { VerifyAction } from 'src/core/enums/auth'
import { RefreshAuthGuard } from 'src/core/guards/refreshAuth.guard'
import { LoginAuthDto, SignupAuthDto } from './auth.dto'
import { AuthService } from './auth.service'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('login')
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto)
  }

  @HttpCode(200)
  @Post('signup')
  signup(@Body() signupAuthDto: SignupAuthDto) {
    return this.authService.signup(signupAuthDto)
  }

  @Post('verify/:token')
  @ApiParam({
    name: 'token',
  })
  @ApiQuery({
    name: 'action',
    enum: VerifyAction,
  })
  verify(
    @Param('token') token: string,
    @Query('action', new ParseEnumPipe(VerifyAction))
    action: VerifyAction,
  ) {
    return this.authService.verify(token, action)
  }

  // @UseGuards(RolesGuard)
  // @Roles(UserRoles.ADMIN)
  @UseGuards(RefreshAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @Post('refresh-token')
  refreshToken(@Headers('authorization') authorization: string) {
    return this.authService.refresh(authorization)
  }
}
