import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Not, Repository } from 'typeorm'
import { extname } from 'path'

import { AccessData } from 'src/core/types/common'
import { getBearerToken } from 'src/core/helper/getToken'
import generateResponse from 'src/core/helper/generateResponse'
import { MessageViewSatus } from 'src/core/enums/conversation'
import { MediaType, RelationType } from 'src/core/enums/media'

import { CreateMessageDto } from './message.dto'
import { ConversationService } from '../conversation/conversation.service'
import Message from './message.entity'
import { User } from '../user/user.entity'
import Conversation from '../conversation/conversation.entity'
import Media from '../media/media.entity'
import { SocketService } from '../socket/socket.service'

@Injectable()
export class MessageService {
  constructor(
    @Inject(forwardRef(() => ConversationService))
    private readonly conversationService: ConversationService,

    private readonly jwtService: JwtService,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly socketService: SocketService,
  ) {}

  async create(
    authorization: string,
    body: CreateMessageDto,
    files?: Express.Multer.File[],
  ) {
    const { id }: AccessData = await this.jwtService.verifyAsync(
      getBearerToken(authorization),
    )

    if (body.type === 'CREATE') {
      if (
        !body?.createConversationData?.userId ||
        id === body.createConversationData.userId
      )
        throw new BadRequestException()

      const existDual = await this.conversationService.existDual(
        id,
        body.createConversationData.userId,
      )
      if (existDual) throw new BadRequestException()

      const conversation = await this.conversationService.create([
        id,
        body.createConversationData.userId,
      ])

      const message = new Message()
      message.content = body.content || ''
      message.conversation = conversation
      // message.seen = false
      message.user = { id } as User
      if (files) {
        message.medias = files.map((file) => {
          const media = new Media()
          media.cdn = file.path.replace('public', '')
          media.user = { id } as User
          media.type =
            extname(file.filename) === '.mp4'
              ? MediaType.VIDEO
              : MediaType.IMAGE
          media.relationType = RelationType.MESSAGE
          return media
        })
      }

      await this.messageRepository.save(message)
      message.medias?.forEach((media) => {
        media.cdn = `${process.env.BE_BASE_URL}${media.cdn}`
      })

      this.socketService.socket.emit(
        `new-conversation-${body.createConversationData.userId}`,
      )
      this.socketService.socket.emit(`new-conversation-${id}`)

      return message
    }

    const message = new Message()
    message.content = body.content || ''
    message.user = { id } as User
    // message.seen = false
    message.conversation = { id: body.conversationId } as Conversation
    if (files) {
      message.medias = files.map((file) => {
        const media = new Media()
        media.cdn = file.path.replace('public', '')
        media.user = { id } as User
        media.type =
          extname(file.filename) === '.mp4' ? MediaType.VIDEO : MediaType.IMAGE
        media.relationType = RelationType.MESSAGE
        return media
      })
    }

    this.conversationService.updateLastSeenGroup(
      'CREATE',
      body.conversationId,
      id,
    )
    await this.messageRepository.save(message)
    message.medias?.forEach((media) => {
      media.cdn = `${process.env.BE_BASE_URL}${media.cdn}`
    })

    this.socketService.socket.emit(`message-${body.conversationId}`, {
      message,
    })

    return message
  }

  async getMessages(
    authorization: string,
    conversationId: string,
    limit: number,
    skip: number,
  ) {
    const { id }: AccessData = await this.jwtService.verifyAsync(
      getBearerToken(authorization),
    )

    const allow = await this.conversationService.exist(id, conversationId)
    if (!allow) throw new ForbiddenException()

    const [messages, count] = await this.messageRepository.findAndCount({
      where: {
        conversation: {
          id: conversationId,
        },
      },
      relations: {
        user: {
          avatarId: true,
        },
        medias: true,
      },

      select: {
        user: {
          id: true,
          name: true,
          username: true,
          avatarId: {
            id: true,
            cdn: true,
          },
        },
        medias: {
          id: true,
          cdn: true,
          type: true,
        },
      },
      take: limit,
      skip,
      order: {
        createdAt: 'DESC',
      },
    })

    messages.forEach((message) => {
      message.user.avatarId.cdn = `${process.env.BE_BASE_URL}${message.user.avatarId.cdn}`
      message.medias.forEach((media) => {
        media.cdn = `${process.env.BE_BASE_URL}${media.cdn}`
      })
    })

    return generateResponse(
      {
        messages,
      },
      {
        count,
      },
    )
  }

  async readAll(authorization: string, conservationId: string) {
    const { id }: AccessData = await this.jwtService.verifyAsync(
      getBearerToken(authorization),
    )

    await this.messageRepository.update(
      {
        conversation: {
          id: conservationId,
        },
        user: {
          id: Not(id),
        },
        viewStatus: Not(MessageViewSatus.VIEWED),
      },
      {
        viewStatus: MessageViewSatus.VIEWED,
      },
    )

    this.socketService.socket.emit(`message-${conservationId}-read-all`)
  }

  async read(authorization: string, messageId: string) {
    const { id }: AccessData = await this.jwtService.verifyAsync(
      getBearerToken(authorization),
    )

    const messsage = await this.messageRepository.findOne({
      where: {
        id: messageId,
        viewStatus: Not(MessageViewSatus.VIEWED),
      },
      relations: {
        conversation: {
          users: true,
        },
      },
      select: {
        conversation: {
          id: true,
          users: {
            id: true,
          },
        },
      },
    })

    if (!messsage) throw new NotFoundException()
    if (!messsage.conversation.users.some((user) => user.id === id))
      throw new ForbiddenException()

    messsage.viewStatus = MessageViewSatus.VIEWED

    this.socketService.socket.emit(`message-${messsage.conversation.id}-read`, {
      messageId: messsage.id,
    })
    this.socketService.socket.emit(`message-${messsage.id}-read`)

    return await this.messageRepository.save(messsage)
  }

  async received(authorization: string, messageId: string) {
    const { id }: AccessData = await this.jwtService.verifyAsync(
      getBearerToken(authorization),
    )

    const messsage = await this.messageRepository.findOne({
      where: {
        id: messageId,
        viewStatus: MessageViewSatus.SENT,
      },
      relations: {
        conversation: {
          users: true,
        },
      },
      select: {
        conversation: {
          id: true,
          users: {
            id: true,
          },
        },
      },
    })

    if (!messsage) throw new NotFoundException()
    if (!messsage.conversation.users.some((user) => user.id === id))
      throw new ForbiddenException()

    messsage.viewStatus = MessageViewSatus.RECEIVED

    await this.messageRepository.save(messsage)

    this.socketService.socket.emit(
      `message-${messsage.conversation.id}-received`,
      {
        messageId: messsage.id,
      },
    )

    return messsage
  }
}
