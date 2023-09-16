import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user.entity'
import RequestFriend from '../request-friend/request-friend.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User, RequestFriend])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
