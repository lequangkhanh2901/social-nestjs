import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import {
  AcceptAction,
  ReportReason,
  ResolveStatus,
} from 'src/core/enums/report'
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

  @Column({
    type: 'enum',
    enum: ['POST', 'COMMENT'],
  })
  type: 'POST' | 'COMMENT'

  @Column({
    type: 'json',
    nullable: true,
  })
  actions: AcceptAction[]

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

  @ManyToOne(() => User, (user) => user.handledReport, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  manager?: User

  @CreateDateColumn()
  createdAt: string

  @UpdateDateColumn()
  updatedAt: string

  @AfterLoad()
  afterLoad() {
    if (this.actions)
      this.actions = JSON.parse(this.actions as unknown as string)
  }

  @BeforeInsert()
  @BeforeUpdate()
  tranferBefor() {
    if (this.actions) this.actions = JSON.stringify(this.actions) as any
  }
}
