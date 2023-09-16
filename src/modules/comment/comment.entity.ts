import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  UpdateDateColumn,
} from 'typeorm'
import { User } from '../user/user.entity'
import Post from '../post/post.entity'
import Like from '../like/like.entity'

@Entity()
@Tree('materialized-path', {})
export default class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    unique: true,
  })
  @Generated('increment')
  id_tree: number

  @ManyToOne(() => User, (user) => user.comments)
  user: User

  @ManyToOne(() => Post, (post) => post.comments)
  post: Post

  @OneToMany(() => Like, (like) => like.comment)
  likes: Like[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
