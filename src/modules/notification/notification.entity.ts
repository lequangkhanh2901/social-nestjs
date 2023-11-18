import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { NotificationType } from 'src/core/enums/notification'
import { User } from '../user/user.entity'
import Post from '../post/post.entity'

@Entity()
export default class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User, (user) => user.notifications)
  user: User

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType

  @ManyToOne(() => User, (user) => user.notificationTargets, {
    nullable: true,
  }) // in [NEW_POST_FROM_FRIEND,NEW_REQUEST_FRIEND,USER_ACCEPTED_REQUEST_FRIEND]
  userTaget: User

  @ManyToOne(() => Post, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  post: Post

  @Column({
    // in [LIKE_MY_POST,LIKE_MY_COMMENT,USER_COMMENTED_MY_POST]
    type: 'json',
    nullable: true,
  })
  userIds: string[]

  @Column({
    default: false,
  })
  isRead: boolean

  @CreateDateColumn()
  createdAt: string

  @Column()
  updatedAt: Date

  @BeforeUpdate()
  @BeforeInsert()
  handleBeforeInsert() {
    if (this.userIds) this.userIds = JSON.stringify(this.userIds) as any
    this.isRead = false
    this.updatedAt = new Date()
  }

  @AfterLoad()
  handleAfterLoad() {
    if (this.userIds)
      this.userIds = JSON.parse(this.userIds as unknown as string)
  }
}
