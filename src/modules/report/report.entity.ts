import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { ReportReason, ResolveStatus } from 'src/core/enums/report'
import { User } from '../user/user.entity'
import Post from '../post/post.entity'
import Comment from '../comment/comment.entity'

@Entity()
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    default: false,
  })
  handled: boolean

  @Column({
    type: 'enum',
    enum: ReportReason,
  })
  reason: ReportReason

  @Column()
  note: string

  @Column({
    type: 'enum',
    enum: ResolveStatus,
    default: ResolveStatus.NONE,
  })
  status: ResolveStatus

  @ManyToOne(() => User, (user) => user.reports)
  user: User

  @ManyToOne(() => User, (user) => user.reportTargets)
  userTarget: User

  @ManyToOne(() => Post, (post) => post.reports, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  post?: Post

  @ManyToOne(() => Comment, (comment) => comment.reports, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  comment?: Comment

  @ManyToOne(() => User, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  manager?: User

  @CreateDateColumn()
  createdAt: string

  @UpdateDateColumn()
  updatedAt: string
}
