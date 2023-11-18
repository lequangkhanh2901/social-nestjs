import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConversationController } from './conversation.controller'
import { ConversationService } from './conversation.service'
import Conversation from './conversation.entity'
import { UserModule } from '../user/user.module'
import { FriendModule } from '../friend/friend.module'
import { MediaModule } from '../media/media.module'

@Module({
  controllers: [ConversationController],
  providers: [ConversationService],
  imports: [
    TypeOrmModule.forFeature([Conversation]),
    forwardRef(() => UserModule),
    forwardRef(() => FriendModule),
    forwardRef(() => MediaModule),
  ],
  exports: [ConversationService],
})
export class ConversationModule {}
