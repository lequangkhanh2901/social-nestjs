import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from '../user/user.entity'
import { MediaType, RelationType } from 'src/core/enums/media'
import Album from '../album/album.entity'
import Post from '../post/post.entity'
import Comment from '../comment/comment.entity'

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

  @ManyToMany(() => Album, (album) => album.medias, {
    nullable: true,
  })
  albums: Album[]

  @ManyToOne(() => Post, (post) => post.medias, {
    onDelete: 'CASCADE',
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

  @CreateDateColumn()
  createdAt: Date
}
