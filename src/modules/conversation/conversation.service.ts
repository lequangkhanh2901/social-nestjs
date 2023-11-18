import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { JwtService } from '@nestjs/jwt'
import { DataSource, In, Like, Not, Repository } from 'typeorm'

import { ConversationRole, ConversationType } from 'src/core/enums/conversation'
import { AccessData } from 'src/core/types/common'
import { getBearerToken } from 'src/core/helper/getToken'
import generateResponse from 'src/core/helper/generateResponse'
import { MediaType } from 'src/core/enums/media'

import Conversation from './conversation.entity'
import { User } from '../user/user.entity'
import { UserService } from '../user/user.service'
import {
  AddUserDto,
  CreateGroupDto,
  KickUserDto,
  UpdateConversationDto,
  UpdateRoleDto,
} from './conversation.dto'
import Media from '../media/media.entity'
import { unlink } from 'fs'
import { SocketService } from '../socket/socket.service'
import { FriendService } from '../friend/friend.service'
import { MediaService } from '../media/media.service'

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    @InjectDataSource() private readonly dataSource: DataSource, // private readonly mediaService: MediaService,
    private readonly socketService: SocketService,
    private readonly friendService: FriendService,
    private readonly mediaService: MediaService,
  ) {}

  async create(
    userIds: string[],
    /**
     * @default: DUAL
     */
    type: ConversationType = ConversationType.DUAL,
  ) {
    const conversation = new Conversation()
    conversation.type = type
    conversation.unreadLastUsersId = JSON.stringify([])
    conversation.users = userIds.map((id) => ({ id } as User))
    await this.conversationRepository.save(conversation)
    return conversation
  }

  async getAll(authorization: string) {
    const { id }: AccessData = await this.jwtService.verifyAsync(
      getBearerToken(authorization),
    )

    // get list conversations
    const _conversations = await this.conversationRepository.find({
      where: {
        users: {
          id,
        },
        // type: ConversationType.DUAL,
      },
      select: {
        id: true,
      },
    })

    //get data conversations
    const conversations = await this.conversationRepository.find({
      where: {
        id: In(_conversations.map((_c) => _c.id)),
      },
      relations: {
        users: {
          avatarId: true,
        },
        avatar: true,
      },
      select: {
        users: {
          id: true,
          name: true,
          username: true,
          avatarId: {
            id: true,
            cdn: true,
          },
        },
        avatar: {
          id: true,
          cdn: true,
        },
      },
    })

    let query = ''
    conversations.forEach((conversation, index) => {
      if (index === conversations.length - 1) {
        query += `(SELECT * FROM message WHERE conversationId = '${conversation.id}' ORDER BY createdAt DESC LIMIT 1) `
      } else {
        query += `(SELECT * FROM message WHERE conversationId = '${conversation.id}' ORDER BY createdAt DESC LIMIT 1) UNION ALL `
      }
    })

    const data = await this.dataSource.query(query)

    conversations.forEach((_c) => {
      _c.unreadLastUsersId = JSON.parse(_c.unreadLastUsersId)

      if (_c.type === ConversationType.DUAL) {
        _c.users = _c.users.filter((_u) => _u.id !== id)
      }

      _c.messages = data.find((message) => message.conversationId === _c.id)

      _c.users.forEach((_u) => {
        _u.avatarId.cdn = `${process.env.BE_BASE_URL}${_u.avatarId.cdn}`
      })

      if (_c.avatar) {
        _c.avatar.cdn = `${process.env.BE_BASE_URL}${_c.avatar.cdn}`
      }
    })

    return generateResponse({
      conversations,
    })
  }

  async existDual(id1: string, id2: string) {
    const [conversation1, conservation2] = await Promise.all([
      this.conversationRepository.find({
        where: {
          type: ConversationType.DUAL,
          users: {
            id: id1,
          },
        },
      }),
      this.conversationRepository.find({
        where: {
          type: ConversationType.DUAL,
          users: {
            id: id2,
          },
        },
      }),
    ])

    const [conversation] = conversation1.filter(
      (_c1) => conservation2.findIndex((_c2) => _c2.id === _c1.id) !== -1,
    )

    if (conversation) return true
    return false
  }

  async exist(userId: string, conversationId: string) {
    return await this.conversationRepository.exist({
      where: {
        id: conversationId,
        users: {
          id: userId,
        },
      },
    })
  }

  async getWithUser(authorization: string, userId: string) {
    const { id }: AccessData = await this.jwtService.verifyAsync(
      getBearerToken(authorization),
    )

    const [conversation1, conservation2] = await Promise.all([
      this.conversationRepository.find({
        where: {
          type: ConversationType.DUAL,
          users: {
            id: id,
          },
        },
      }),
      this.conversationRepository.find({
        where: {
          type: ConversationType.DUAL,
          users: {
            id: userId,
          },
        },
      }),
    ])

    const [conversation] = conversation1.filter(
      (_c1) => conservation2.findIndex((_c2) => _c2.id === _c1.id) !== -1,
    )

    if (conversation)
      return generateResponse(
        {
          conversation,
        },
        {
          message: 'EXIST',
        },
      )

    return generateResponse(
      {},
      {
        message: 'NOT_EXIST',
      },
    )
  }

  async createGroup(
    authorization: string,
    body: CreateGroupDto,
    avatar: Express.Multer.File,
  ) {
    const { id }: AccessData = await this.jwtService.verifyAsync(
      getBearerToken(authorization),
    )

    const conversation = new Conversation()
    conversation.name = body.name
    const media = new Media()
    media.cdn = avatar.path.replace('public', '')
    media.type = MediaType.IMAGE

    conversation.avatar = media
    conversation.unreadLastUsersId = '[]'
    conversation.type = ConversationType.GROUP
    conversation.chief = { id } as User
    conversation.users = [{ id } as User]

    await this.conversationRepository.save(conversation)

    return conversation
  }

  async updateLastSeenGroup(
    type: 'CREATE' | 'READ',
    conversationId: string,
    userId: string,
  ) {
    const conversation = await this.conversationRepository.findOne({
      where: {
        id: conversationId,
      },
      relations: {
        users: true,
      },
      select: {
        users: { id: true },
      },
    })

    if (conversation.type === ConversationType.GROUP) {
      if (type === 'CREATE') {
        conversation.unreadLastUsersId = JSON.stringify(
          conversation.users
            .filter((user) => user.id !== userId)
            .map((user) => user.id),
        )
      } else {
        conversation.unreadLastUsersId = JSON.stringify(
          (JSON.parse(conversation.unreadLastUsersId) as string[]).filter(
            (_userId) => _userId !== userId,
          ),
        )
      }

      await this.conversationRepository.save(conversation)
    }
  }

  async getInfo(authorization: string, conservationId: string) {
    const { id }: AccessData = await this.jwtService.verifyAsync(
      getBearerToken(authorization),
    )

    const conversation = await this.conversationRepository.findOne({
      where: {
        id: conservationId,
      },
      relations: {
        users: {
          avatarId: true,
        },
        chief: true,
        deputies: true,
        avatar: true,
      },
      select: {
        id: true,
        unreadLastUsersId: true,
        type: true,
        name: true,
        createdAt: true,
        users: {
          id: true,
          name: true,
          username: true,
          avatarId: {
            id: true,
            cdn: true,
          },
        },
        chief: {
          id: true,
        },
        deputies: {
          id: true,
        },
        avatar: {
          id: true,
          cdn: true,
        },
      },
    })

    if (conversation.chief) {
      // conversation.chief.avatarId.cdn = `${process.env.BE_BASE_URL}${conversation.chief.avatarId.cdn}`
    }
    if (conversation.avatar) {
      conversation.avatar.cdn = `${process.env.BE_BASE_URL}${conversation.avatar.cdn}`
    }

    if (conversation.type === ConversationType.DUAL) {
      conversation.users = conversation.users.filter((_user) => _user.id !== id)
      conversation.users.forEach((_user) => {
        _user.avatarId.cdn = `${process.env.BE_BASE_URL}${_user.avatarId.cdn}`
      })
    } else {
      delete conversation.users
    }
    conversation.unreadLastUsersId = JSON.parse(conversation.unreadLastUsersId)

    return conversation
  }

  async getMembers(authorization: string, conservationId: string) {
    const { id }: AccessData = await this.jwtService.verifyAsync(
      getBearerToken(authorization),
    )

    const conversation = await this.conversationRepository.findOne({
      where: {
        id: conservationId,
      },
      relations: {
        users: {
          avatarId: true,
        },
      },
      select: {
        users: {
          id: true,
          name: true,
          username: true,
          avatarId: {
            id: true,
            cdn: true,
          },
        },
        id: true,
      },
    })

    if (!conversation.users.some((_user) => _user.id === id))
      throw new ForbiddenException()

    conversation.users.forEach((_user) => {
      _user.avatarId.cdn = `${process.env.BE_BASE_URL}${_user.avatarId.cdn}`
    })

    return conversation
  }

  async update(
    authorization,
    body: UpdateConversationDto,
    avatar?: Express.Multer.File,
  ) {
    const conversation = await this.conversationRepository.findOne({
      where: {
        id: body.id,
      },
      relations: {
        chief: true,
        avatar: true,
      },
      select: {
        chief: {
          id: true,
        },
        avatar: {
          id: true,
          cdn: true,
        },
      },
    })

    if (!conversation) throw new NotFoundException()
    const { id }: AccessData = await this.jwtService.verifyAsync(
      getBearerToken(authorization),
    )
    if (conversation.chief.id !== id) throw new ForbiddenException()

    if (body.name) conversation.name = body.name

    if (body.status) conversation.status = body.status

    if (avatar) {
      // const media =

      unlink(
        __dirname.replace('dist/modules/conversation', 'public') +
          conversation.avatar.cdn,
        () => {
          //
        },
      )

      conversation.avatar.cdn = avatar.path.replace('public', '')

      // this.mediaService.deleteMediasByIds([conversation.avatar.id])
    }

    await this.conversationRepository.save(conversation)
    conversation.avatar.cdn = `${process.env.BE_BASE_URL}${conversation.avatar.cdn}`
    this.socketService.socket.emit(
      `conversation-${body.id}-update`,
      conversation,
    )
    return conversation
  }

  async findForInvite(
    authorization: string,
    conversationId: string,
    name: string,
    skip: number,
    limit: number,
  ) {
    const { id }: AccessData = await this.jwtService.verifyAsync(
      getBearerToken(authorization),
    )
    const conservation = await this.conversationRepository.findOne({
      where: {
        id: conversationId,
      },
      relations: {
        users: true,
      },
      select: {
        users: {
          id: true,
        },
        id: true,
      },
    })

    const friends = await this.friendService.getFriends({
      where: [
        {
          user_one: {
            id: id,
          },
          user_two: {
            id: Not(In(conservation.users.map((user) => user.id))),
            name: Like(`%${name}%`),
          },
        },
        {
          user_one: {
            id: Not(In(conservation.users.map((user) => user.id))),
            name: Like(`%${name}%`),
          },
          user_two: {
            id: id,
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

    return friends
      .map((friend) => {
        if (friend.user_one.id === id) return friend.user_two
        return friend.user_one
      })
      .map((user) => {
        user.avatarId.cdn = `${process.env.BE_BASE_URL}${user.avatarId.cdn}`
        return user
      })
  }

  async addUser(authorization: string, body: AddUserDto) {
    const { id }: AccessData = await this.jwtService.verifyAsync(
      getBearerToken(authorization),
    )

    const conservation = await this.conversationRepository.findOne({
      where: {
        id: body.id,
        type: ConversationType.GROUP,
      },
      relations: {
        users: true,
      },
      select: {
        users: {
          id: true,
        },
      },
    })

    if (!conservation) throw new NotFoundException()

    if (
      !conservation.users.some((user) => user.id === id) ||
      conservation.users.some((user) => user.id === body.userId)
    )
      throw new BadRequestException()

    const [user] = (await this.userService.getUsersOption({
      options: {
        where: {
          id: body.userId,
        },
        select: {
          id: true,
        },
      },
    })) as [User]
    if (!user) throw new NotFoundException()

    conservation.users.push(user)

    await this.conversationRepository.save(conservation)

    this.socketService.socket.emit(`new-conversation-${body.userId}`)
    this.socketService.socket.emit(`new-member-conversation-${conservation.id}`)
    return {
      user,
    }
  }

  async kickUser(authorization: string, body: KickUserDto) {
    const conservation = await this.conversationRepository.findOne({
      where: {
        id: body.id,
      },
      relations: {
        chief: true,
        users: true,
        deputies: true,
      },
      select: {
        chief: {
          id: true,
        },
        users: {
          id: true,
        },
        deputies: {
          id: true,
        },
      },
    })
    if (!conservation) throw new NotFoundException()

    const { id }: AccessData = await this.jwtService.verifyAsync(
      getBearerToken(authorization),
    )
    if (!conservation.users.some((user) => user.id === body.userId))
      throw new NotFoundException()

    if (
      body.userId === conservation.chief.id ||
      (conservation.deputies.some((user) => user.id === id) &&
        conservation.deputies.some((user) => user.id === body.userId)) ||
      (id !== conservation.chief.id &&
        !conservation.deputies.some((user) => user.id === id))
    )
      throw new ForbiddenException()

    if (conservation.deputies.some((user) => user.id === body.userId)) {
      conservation.users = conservation.deputies.filter(
        (_user) => _user.id !== body.userId,
      )
    }
    conservation.users = conservation.users.filter(
      (_user) => _user.id !== body.userId,
    )

    await this.conversationRepository.save(conservation)
    return conservation
  }

  async quitGroup(authorization: string, conservationId: string) {
    const conversation = await this.conversationRepository.findOne({
      where: {
        id: conservationId,
      },
      relations: {
        chief: true,
        users: true,
        deputies: true,
      },
      select: {
        chief: {
          id: true,
        },
        users: {
          id: true,
        },
        deputies: {
          id: true,
        },
      },
    })
    if (!conversation) throw new NotFoundException()

    const { id }: AccessData = await this.jwtService.verifyAsync(
      getBearerToken(authorization),
    )
    if (!conversation.users.some((user) => user.id === id))
      throw new ForbiddenException()

    if (conversation.chief.id === id) return 'cancel'

    conversation.users = conversation.users.filter((user) => user.id !== id)
    if (conversation.deputies.some((user) => user.id === id))
      conversation.deputies = conversation.deputies.filter(
        (user) => user.id !== id,
      )

    await this.conversationRepository.save(conversation)
    this.socketService.socket.emit(`quit-conversation-${conservationId}`, id)

    return conversation
  }

  async getMedias(
    authorization: string,
    conservationId: string,
    skip: number,
    limit: number,
  ) {
    const conversation = await this.conversationRepository.findOne({
      where: {
        id: conservationId,
      },
      relations: {
        messages: true,
        users: true,
      },

      select: {
        id: true,
        users: {
          id: true,
        },
        messages: {
          id: true,
        },
      },
    })

    if (!conversation) throw new NotFoundException()

    const { id }: AccessData = await this.jwtService.verifyAsync(
      getBearerToken(authorization),
    )
    if (!conversation.users.some((user) => user.id === id))
      throw new ForbiddenException()

    const media = await this.mediaService.getMediasByMessageIds(
      conversation.messages.map((message) => message.id),
      skip,
      limit,
    )

    return media
  }

  async updateRole(authorization: string, body: UpdateRoleDto) {
    const conversation = await this.conversationRepository.findOne({
      where: {
        id: body.conversationId,
      },
      relations: {
        chief: true,
        users: true,
        deputies: true,
      },
      select: {
        id: true,
        chief: {
          id: true,
        },
        deputies: {
          id: true,
        },
        users: {
          id: true,
        },
      },
    })

    if (!conversation) throw new NotFoundException()
    const { id }: AccessData = await this.jwtService.verifyAsync(
      getBearerToken(authorization),
    )
    if (id !== conversation.chief.id) throw new ForbiddenException()
    if (!conversation.users.some((user) => user.id === body.userId))
      throw new BadRequestException()

    if (body.role === ConversationRole.VICE_CHIEF) {
      if (conversation.deputies.some((user) => user.id === body.userId))
        throw new BadRequestException()

      conversation.deputies.push({ id: body.userId } as User)
    }

    if (body.role === ConversationRole.MEMBER) {
      if (!conversation.deputies.some((user) => user.id === body.userId))
        throw new BadRequestException()
      conversation.deputies = conversation.deputies.filter(
        (user) => user.id !== body.userId,
      )
    }

    await this.conversationRepository.save(conversation)

    return conversation
  }

  async readLastGroup(authorization: string, conservationId: string) {
    const { id }: AccessData = await this.jwtService.verifyAsync(
      getBearerToken(authorization),
    )
    await this.updateLastSeenGroup('READ', conservationId, id)
    return
  }
}
