import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from '../user/user.entity'
import Media from '../media/media.entity'

@Entity({
  name: 'albums',
})
export default class Album {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User, (user) => user.albums)
  user: User

  @Column({
    length: 100,
  })
  name: string

  @Column({
    type: 'enum',
    enum: ['DEFAULT', 'CUSTOM'],
  })
  type: 'DEFAULT' | 'CUSTOM'

  @ManyToMany(() => Media, (media) => media.albums)
  @JoinTable()
  medias: Media[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
