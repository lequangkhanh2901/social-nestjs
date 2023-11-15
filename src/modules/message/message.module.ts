import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { MessageController } from './message.controller'
import { MessageService } from './message.service'
import { ConversationModule } from '../conversation/conversation.module'
import Message from './message.entity'

@Module({
  controllers: [MessageController],
  providers: [MessageService],
  imports: [TypeOrmModule.forFeature([Message]), ConversationModule],
})
export class MessageModule {}
