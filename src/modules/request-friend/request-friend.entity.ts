import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from '../user/user.entity'

@Entity()
export default class RequestFriend {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User, (user) => user.request_friend, {
    onDelete: 'CASCADE',
  })
  user: User

  @ManyToOne(() => User, (user) => user.request_friend_receive, {
    onDelete: 'CASCADE',
  })
  user_target: User

  @CreateDateColumn()
  createdAt: Date
}
