import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import Post from '../post/post.entity'
import Comment from '../comment/comment.entity'

@Entity({
  name: 'likes',
})
export default class Like {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Post, (post) => post.id, {
    nullable: true,
  })
  post: Post

  @ManyToOne(() => Comment, (comment) => comment.id, {
    nullable: true,
  })
  comment: Comment

  @CreateDateColumn()
  createdAt: Date
}
