import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from '../user/user.entity'
import { MediaType, RelationType } from 'src/core/enums/media'
import Post from '../post/post.entity'
import Comment from '../comment/comment.entity'
import Message from '../message/message.entity'
import Conversation from '../conversation/conversation.entity'

@Entity({
  name: 'medias',
})
export default class Media {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User, (user) => user.medias)
  user: User

  @Column()
  cdn: string

  @Column({
    type: 'enum',
    enum: MediaType,
  })
  type: MediaType

  @Column({
    nullable: true,
    type: 'text',
  })
  name: string | null

  // @ManyToMany(() => Album, (album) => album.medias, {
  //   nullable: true,
  //   cascade: true,
  // })
  // albums: Album[]

  @ManyToOne(() => Post, (post) => post.medias, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  post: Post

  @OneToOne(() => Comment, (comment) => comment.media, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  comment: Comment

  @Column({
    type: 'enum',
    enum: RelationType,
    default: RelationType.POST,
  })
  relationType: RelationType

  @ManyToOne(() => Message, (message) => message.medias, {
    onDelete: 'CASCADE',
  })
  message: Message

  @OneToOne(() => Conversation, { onDelete: 'CASCADE' })
  conversation: Conversation

  @CreateDateColumn()
  createdAt: Date
}
