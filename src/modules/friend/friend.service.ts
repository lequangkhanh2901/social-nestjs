import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { JwtService } from '@nestjs/jwt'
import { DataSource, Like, Repository } from 'typeorm'

import { AccessData } from 'src/core/types/common'
import { getBearerToken } from 'src/core/helper/getToken'
import generateResponse from 'src/core/helper/generateResponse'

import Friend from './friend.entity'
import { UserService } from '../user/user.service'
import { User } from '../user/user.entity'

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Friend)
    private readonly friendRepository: Repository<Friend>,
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    @InjectDataSource() private readonly dataSource: DataSource,
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

  async add(id1: string, id2: string) {
    const friend = new Friend()
    const user1 = new User()
    const user2 = new User()
    user1.id = id1
    user2.id = id2
    friend.user_one = user1
    friend.user_two = user2

    return await this.friendRepository.save(friend)
  }
  async count(id: string) {
    const count = await this.friendRepository.count({
      where: [
        {
          user_one: {
            id: id,
          },
        },
        {
          user_two: {
            id: id,
          },
        },
      ],
    })

    return count
  }

  async isExist(id1: string, id2: string) {
    return await this.friendRepository.exist({
      where: [
        {
          user_one: {
            id: id1,
          },
          user_two: {
            id: id2,
          },
        },
        {
          user_one: {
            id: id2,
          },
          user_two: {
            id: id1,
          },
        },
      ],
    })
  }

  async getFriendsUsername({
    authorization,
    username,
    type = 'ALL',
    limit = 10,
    skip = 0,
    search,
  }: {
    authorization: string
    username: string
    type: 'ALL' | 'SAME_FRIEND'
    limit?: number
    skip?: number
    search?: string
  }) {
    const { id }: AccessData = await this.jwtService.verify(
      getBearerToken(authorization),
    )

    const user = await this.userService.getByUsernameOptions(username, {
      select: {
        id: true,
      },
    })

    if (!user) throw new NotFoundException()
    if (type === 'SAME_FRIEND') {
      if (user.id === id) throw new BadRequestException()

      const userIds = await this.getSameFriendsId(id, user.id)
      if (userIds.length === 0)
        return generateResponse(
          {
            friends: [],
          },
          { count: 0 },
        )

      const [users, count] = await Promise.all([
        this.dataSource.query(
          `SELECT users.id, users.name, users.username, medias.id AS avatarId, medias.cdn FROM users INNER JOIN medias ON users.avatarIdId = medias.id WHERE (${userIds.map(
            (_id, index) => {
              if (index === userIds.length - 1) return `users.id = '${_id}' `
              return `users.id = '${_id}' OR `
            },
          )}) ${
            search
              ? `AND (users.name LIKE '%${search}%' OR users.username = '%${search}%')`
              : ''
          }`,
        ),
        this.userService.count({
          where: userIds.flatMap((_id) => [
            { id: _id, name: search ? Like(`%${search}%`) : undefined },
            { id: _id, username: search ? Like(`%${search}%`) : undefined },
          ]),
        }),
      ])

      return generateResponse(
        {
          friends: users.map((_user) => ({
            ..._user,
            cdn: `${process.env.BE_BASE_URL}${_user.cdn}`,
          })),
        },
        {
          count,
        },
      )
    }

    // get relation here

    const [friends, count] = await this.friendRepository.findAndCount({
      where: [
        {
          user_one: {
            id: user.id,
          },
          user_two: {
            name: search ? Like(`%${search}%`) : undefined,
          },
        },
        {
          user_one: {
            name: search ? Like(`%${search}%`) : undefined,
          },
          user_two: {
            id: user.id,
          },
        },
        {
          user_one: {
            id: user.id,
          },
          user_two: {
            username: search ? Like(`%${search}%`) : undefined,
          },
        },
        {
          user_one: {
            username: search ? Like(`%${search}%`) : undefined,
          },
          user_two: {
            id: user.id,
          },
        },
      ],
      relations: {
        user_one: {
          avatarId: true,
        },
        user_two: {
          avatarId: true,
        },
      },
      select: {
        user_one: {
          id: true,
          name: true,
          username: true,
          avatarId: {
            id: true,
            cdn: true,
          },
        },
        user_two: {
          id: true,
          name: true,
          username: true,
          avatarId: {
            id: true,
            cdn: true,
          },
        },
      },
      take: limit,
      skip,
    })

    const _friends = friends.map((friend) => {
      if (friend.user_one.id === user.id) {
        friend['user'] = friend.user_two
      } else {
        friend['user'] = friend.user_one
      }
      delete friend.user_one
      delete friend.user_two

      friend[
        'user'
      ].avatarId.cdn = `${process.env.BE_BASE_URL}${friend['user'].avatarId.cdn}`

      return friend
    })

    return generateResponse(
      {
        friends: _friends,
      },
      {
        count,
      },
    )
  }

  async getMyFriends(authorization: string, limit = 12, skip = 0) {
    const { id }: AccessData = await this.jwtService.verify(
      getBearerToken(authorization),
    )

    const [friends, count] = await this.friendRepository.findAndCount({
      where: [
        {
          user_one: {
            id,
          },
        },
        {
          user_two: {
            id,
          },
        },
      ],
      relations: {
        user_one: {
          avatarId: true,
        },
        user_two: {
          avatarId: true,
        },
      },
      select: {
        user_one: {
          id: true,
          name: true,
          username: true,
          avatarId: {
            id: true,
            cdn: true,
          },
        },
        user_two: {
          id: true,
          name: true,
          username: true,
          avatarId: {
            id: true,
            cdn: true,
          },
        },
      },
      take: limit,
      skip,
    })

    friends.forEach((friend) => {
      if (friend.user_one.id === id) {
        friend['user'] = friend.user_two
      } else {
        friend['user'] = friend.user_one
      }

      delete friend.user_two
      delete friend.user_one
      friend[
        'user'
      ].avatarId.cdn = `${process.env.BE_BASE_URL}${friend['user'].avatarId.cdn}`
    })

    return generateResponse(
      {
        friends,
      },
      {
        count,
      },
    )
  }

  async getSameFriendsId(currentUserId: string, targetUserId: string) {
    const [friendsOfCurrent, friendsOfTarget] = await Promise.all([
      this.friendRepository.find({
        where: [
          {
            user_one: {
              id: currentUserId,
            },
          },
          {
            user_two: {
              id: currentUserId,
            },
          },
        ],
        relations: {
          user_one: true,
          user_two: true,
        },
        select: {
          user_one: {
            id: true,
          },
          user_two: {
            id: true,
          },
        },
      }),
      this.friendRepository.find({
        where: [
          {
            user_one: {
              id: targetUserId,
            },
          },
          {
            user_two: {
              id: targetUserId,
            },
          },
        ],
        relations: {
          user_one: true,
          user_two: true,
        },
        select: {
          user_one: {
            id: true,
          },
          user_two: {
            id: true,
          },
        },
      }),
    ])

    const idFriendsOfCurrent = friendsOfCurrent.map((friend) => {
      if (friend.user_one.id === currentUserId) return friend.user_two.id
      return friend.user_one.id
    })

    const idFriendsTarget = friendsOfTarget.map((friend) => {
      if (friend.user_one.id === targetUserId) return friend.user_two.id
      return friend.user_one.id
    })

    return idFriendsOfCurrent.filter((id) => idFriendsTarget.includes(id))
  }

  async countSameFriend(currentUserId: string, targetUserId: string) {
    return (await this.getSameFriendsId(currentUserId, targetUserId)).length
  }
}
