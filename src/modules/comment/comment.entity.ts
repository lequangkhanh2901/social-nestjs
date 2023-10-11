import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
  UpdateDateColumn,
} from 'typeorm'
import { User } from '../user/user.entity'
import Post from '../post/post.entity'
import Like from '../like/like.entity'
import Media from '../media/media.entity'

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
    onDelete: 'CASCADE',
  })
  post: Post

  @Column({
    type: 'text',
    nullable: true,
  })
  content: string

  @OneToMany(() => Like, (like) => like.comment)
  likes: Like[]

  @TreeParent({
    onDelete: 'CASCADE',
  })
  parent: Comment

  @TreeChildren({
    cascade: true,
  })
  children: Comment[]

  @OneToOne(() => Media, (media) => media.comment, {
    cascade: true,
  })
  media: Media

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
