import { UserRoles, UserSex, UserStatus } from 'src/core/enums/user'
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import RequestFriend from '../request-friend/request-friend.entity'
import Media from '../media/media.entity'
import Post from '../post/post.entity'
import Comment from '../comment/comment.entity'
import Like from '../like/like.entity'
import Conversation from '../conversation/conversation.entity'
import Message from '../message/message.entity'
import Notification from '../notification/notification.entity'
import Friend from '../friend/friend.entity'
import { Report } from '../report/report.entity'

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 50, default: '' })
  @Index()
  name: string

  @Column({ length: 50, unique: true, nullable: true })
  username: string

  @Column({ length: 100, unique: true })
  email: string

  @Column({
    type: 'text',
  })
  password: string

  @Column({
    default: false,
  })
  actived: boolean

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus

  @Column({ type: 'enum', enum: UserRoles, default: UserRoles.NORMAL })
  role: UserRoles

  @Column({ default: '' })
  avatar: string

  @Column({
    type: 'enum',
    enum: UserSex,
    default: UserSex.OTHER,
  })
  sex: UserSex

  @Column({
    type: 'datetime',
    nullable: true,
  })
  unBanTime?: Date

  @OneToOne(() => Media, {
    cascade: true,
  })
  @JoinColumn()
  avatarId: Media

  // @ManyToMany(() => User)
  // @JoinTable()
  // friends: User[]

  @OneToMany(() => RequestFriend, (request) => request.user, {
    cascade: true,
  })
  request_friend: RequestFriend[]

  @OneToMany(() => RequestFriend, (request) => request.user_target, {
    cascade: true,
  })
  request_friend_receive: RequestFriend[]

  @OneToMany(() => Media, (media) => media.id)
  medias: Media[]

  // @OneToMany(() => Album, (album) => album.user, {
  //   cascade: true,
  // })
  // albums: Album[]

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[]

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[]

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[]

  @ManyToMany(() => Conversation, (conversation) => conversation.users)
  conversations: Conversation[]

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[]

  @ManyToMany(() => Conversation, (conservations) => conservations.deputies)
  conversationsDeputies: Conversation[]

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[]

  @OneToMany(() => Notification, (notification) => notification.userTaget)
  notificationTargets: Notification[]

  @OneToMany(() => Friend, (friend) => friend.user_one)
  friendAsOne: Friend[]

  @OneToMany(() => Friend, (friend) => friend.user_two)
  friendAsTwo: Friend[]

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[]

  @OneToMany(() => Report, (report) => report.userTarget)
  reportTargets: Report[]

  @OneToMany(() => Report, (report) => report.manager) // handled by manager
  handledReport: Report[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
