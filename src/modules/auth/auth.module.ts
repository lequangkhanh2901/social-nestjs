import { Module, forwardRef } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { MailModule } from 'src/modules/mail/mail.module'
import { UserModule } from 'src/modules/user/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => UserModule),
    forwardRef(() => MailModule),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
