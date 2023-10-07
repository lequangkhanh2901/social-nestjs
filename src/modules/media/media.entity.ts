import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from '../user/user.entity'
import { MediaType } from 'src/core/enums/media'
import Album from '../album/album.entity'
import Post from '../post/post.entity'

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

  @ManyToOne(() => Post, (post) => post.medias)
  post: Post

  @CreateDateColumn()
  createdAt: Date
}
