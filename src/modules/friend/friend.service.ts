import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import Friend from './friend.entity'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'
import { User } from '../user/user.entity'

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

  async getIdsFriendOfUser(idUser: string) {
    const user = new User()
    user.id = idUser
    const friends = await this.friendRepository.find({
      where: [
        {
          user_one: user,
        },
        {
          user_two: user,
        },
      ],
      relations: {
        user_one: true,
        user_two: true,
      },
      select: {
        user_one: { id: true },
        user_two: { id: true },
      },
    })
    return friends.map((friend) => {
      return friend.user_one.id === idUser
        ? friend.user_two.id
        : friend.user_one.id
    })
  }
}
