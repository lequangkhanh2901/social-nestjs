import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity({
  name: 'albums',
})
export default class Album {
  @PrimaryGeneratedColumn('uuid')
  id: string

  // @ManyToOne(() => User, (user) => user.albums)
  // user: User

  @Column({
    length: 100,
  })
  name: string

  @Column({
    type: 'enum',
    enum: ['DEFAULT', 'CUSTOM'],
  })
  type: 'DEFAULT' | 'CUSTOM'

  // @ManyToMany(() => Media, (media) => media.albums, {
  //   onDelete: 'CASCADE',
  // })
  // @JoinTable()
  // medias: Media[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
