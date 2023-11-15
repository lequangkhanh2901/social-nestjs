import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConversationController } from './conversation.controller'
import { ConversationService } from './conversation.service'
import Conversation from './conversation.entity'
import { UserModule } from '../user/user.module'
import { FriendModule } from '../friend/friend.module'

@Module({
  controllers: [ConversationController],
  providers: [ConversationService],
  imports: [TypeOrmModule.forFeature([Conversation]), UserModule, FriendModule],
  exports: [ConversationService],
})
export class ConversationModule {}
