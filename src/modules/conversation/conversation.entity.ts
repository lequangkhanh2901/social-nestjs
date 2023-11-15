import {
  ConversationStatus,
  ConversationType,
} from 'src/core/enums/conversation'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from '../user/user.entity'
import Message from '../message/message.entity'
import Media from '../media/media.entity'

@Entity()
export default class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    length: 30,
    nullable: true,
  })
  name: string

  @Column({
    type: 'enum',
    enum: ConversationType,
  })
  type: ConversationType

  @Column({
    type: 'enum',
    enum: ConversationStatus,
  })
  status: ConversationStatus

  @Column({
    type: 'json',
  })
  unreadLastUsersId: string

  @ManyToMany(() => User, (user) => user.id)
  @JoinTable()
  users: User[]

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[]

  @OneToOne(() => User, { nullable: true, cascade: true })
  @JoinColumn()
  chief: User

  @ManyToMany(() => User, (user) => user.conversationsDeputies)
  @JoinTable()
  deputies: User[]

  @OneToOne(() => Media, {
    cascade: true,
  })
  @JoinColumn()
  avatar: Media

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
