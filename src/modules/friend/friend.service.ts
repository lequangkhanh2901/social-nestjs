import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import Friend from './friend.entity'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Friend)
    private readonly friendRepository: Repository<Friend>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async getFriend(uid1: string, uid2: string) {
    const [user1, user2] = await this.userService.getUsers([uid1, uid2])

    if (!user1 || !user2) throw new NotFoundException()

    const friend = await this.friendRepository.findOne({
      where: [
        {
          user_one: user1,
          user_two: user2,
        },
        {
          user_one: user2,
          user_two: user1,
        },
      ],
    })

    return friend
  }
}
