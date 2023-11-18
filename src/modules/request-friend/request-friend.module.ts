import { Module, forwardRef } from '@nestjs/common'
import { RequestFriendController } from './request-friend.controller'
import { RequestFriendService } from './request-friend.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import RequestFriend from './request-friend.entity'
import { FriendModule } from '../friend/friend.module'
import { UserModule } from '../user/user.module'

@Module({
  controllers: [RequestFriendController],
  providers: [RequestFriendService],
  imports: [
    TypeOrmModule.forFeature([RequestFriend]),
    forwardRef(() => FriendModule),
    forwardRef(() => UserModule),
  ],
  exports: [RequestFriendService],
})
export class RequestFriendModule {}
