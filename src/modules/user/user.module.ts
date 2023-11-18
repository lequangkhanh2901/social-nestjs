import { Module, forwardRef } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user.entity'
import { FriendModule } from '../friend/friend.module'
import { RequestFriendModule } from '../request-friend/request-friend.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => FriendModule),
    forwardRef(() => RequestFriendModule),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
