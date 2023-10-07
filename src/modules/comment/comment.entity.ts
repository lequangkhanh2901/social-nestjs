import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
  UpdateDateColumn,
} from 'typeorm'
import { User } from '../user/user.entity'
import Post from '../post/post.entity'
import Like from '../like/like.entity'

@Entity()
@Tree('materialized-path')
export default class Comment {
  @PrimaryGeneratedColumn('increment')
  id: number

  @ManyToOne(() => User, (user) => user.comments, {
    nullable: false,
  })
  user: User

  @ManyToOne(() => Post, (post) => post.comments, {
    nullable: false,
  })
  post: Post

  @Column({
    type: 'text',
    nullable: true,
  })
  content: string

  @OneToMany(() => Like, (like) => like.comment)
  likes: Like[]

  @TreeParent()
  parent: Comment

  @TreeChildren()
  children: Comment[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
