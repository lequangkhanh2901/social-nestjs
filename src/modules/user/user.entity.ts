import { UserRoles, UserStatus } from 'src/core/enums/user'
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 50, default: '' })
  @Index()
  name: string

  @Column({ length: 50, default: '' })
  @Index()
  username: string

  @Column({ length: 100, unique: true })
  email: string

  @Column({
    type: 'text',
  })
  password: string

  @Column({
    default: false,
  })
  actived: boolean

  @Column({ default: UserStatus.ACTIVE })
  status: UserStatus

  @Column({ default: UserRoles.NORMAL })
  role: UserRoles

  @Column({ default: '' })
  avatar: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
