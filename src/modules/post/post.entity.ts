import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from '../user/user.entity'
import { PostType } from 'src/core/enums/post'
import Comment from '../comment/comment.entity'
import Like from '../like/like.entity'
import Media from '../media/media.entity'

@Entity({
  name: 'posts',
})
export default class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User, (user) => user.posts)
  user: User

  @Column({
    type: 'text',
  })
  content: string

  @Column({
    type: 'enum',
    enum: PostType,
  })
  type: PostType

  @OneToMany(() => Comment, (comment) => comment.post, {
    cascade: true,
  })
  comments: Comment[]

  @OneToMany(() => Like, (like) => like.post, {
    cascade: true,
  })
  likes: Like[]

  @OneToMany(() => Media, (media) => media.post, {
    cascade: true,
  })
  medias: Media[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
