import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from '../user/user.entity'

@Entity({
  name: 'friends',
})
export default class Friend {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, (user) => user.friendAsOne, {
    onDelete: 'CASCADE',
  })
  user_one: User

  @ManyToOne(() => User, (user) => user.friendAsTwo, {
    onDelete: 'CASCADE',
  })
  user_two: User

  @CreateDateColumn()
  createdAt: Date
}
