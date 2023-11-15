import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { MessageStatus, MessageViewSatus } from 'src/core/enums/conversation'

import { User } from '../user/user.entity'
import Media from '../media/media.entity'
import Conversation from '../conversation/conversation.entity'

@Entity()
export default class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    type: 'text',
  })
  content: string

  @Column({
    type: 'enum',
    enum: MessageStatus,
    default: MessageStatus.NORMAL,
  })
  status: MessageStatus

  // @Column({
  //   type: 'boolean',
  //   default: true,
  // })
  // seen: boolean

  @Column({
    type: 'enum',
    enum: MessageViewSatus,
    default: MessageViewSatus.SENT,
  })
  viewStatus: MessageViewSatus

  @ManyToOne(() => User, (user) => user.messages)
  user: User

  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  conversation: Conversation

  @OneToMany(() => Media, (media) => media.message, {
    cascade: true,
  })
  medias: Media[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
