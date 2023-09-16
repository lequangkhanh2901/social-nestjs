import { Module } from '@nestjs/common'
import { RequestFriendController } from './request-friend.controller'
import { RequestFriendService } from './request-friend.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import RequestFriend from './request-friend.entity'
import { FriendModule } from '../friend/friend.module'

@Module({
  controllers: [RequestFriendController],
  providers: [RequestFriendService],
  imports: [TypeOrmModule.forFeature([RequestFriend]), FriendModule],
})
export class RequestFriendModule {}
