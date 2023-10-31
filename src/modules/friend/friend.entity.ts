import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from '../user/user.entity'

@Entity({
  name: 'friends',
})
export default class Friend {
  @PrimaryGeneratedColumn()
  id: number

  @OneToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user_one: User

  @OneToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user_two: User

  @CreateDateColumn()
  createdAt: Date
}
