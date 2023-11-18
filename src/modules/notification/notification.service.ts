import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'

import { getBearerToken } from 'src/core/helper/getToken'
import { AccessData } from 'src/core/types/common'
import { NotificationType } from 'src/core/enums/notification'
import generateResponse from 'src/core/helper/generateResponse'

import Notification from './notification.entity'
import { User } from '../user/user.entity'
import Post from '../post/post.entity'
import { FriendService } from '../friend/friend.service'
import { UserService } from '../user/user.service'
import { PostService } from '../post/post.service'
import { SocketService } from '../socket/socket.service'

@Injectable()
export class NotificationService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,

    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,

    @Inject(forwardRef(() => FriendService))
    private readonly friendService: FriendService,

    @Inject(forwardRef(() => PostService))
    private readonly postService: PostService,

    private readonly socketService: SocketService,

    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async getNotifications(
    authorization: string,
    skip: number,
    limit: number,
    status: 'ALL' | 'UNREAD' = 'ALL',
  ) {
    const { id }: AccessData = await this.jwtService.verifyAsync(
      getBearerToken(authorization),
    )
    const [[notifications, count], countUnread] = await Promise.all([
      this.notificationRepository.findAndCount({
        where: {
          user: {
            id,
          },
          isRead: status === 'UNREAD' ? false : undefined,
        },
        relations: {
          post: true,
          userTaget: {
            avatarId: true,
          },
        },
        select: {
          post: {
            id: true,
          },
          userTaget: {
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
        order: {
          updatedAt: 'DESC',
        },
      }),
      this.notificationRepository.count({
        where: {
          user: {
            id,
          },
          isRead: false,
        },
      }),
    ])
    const _users = await Promise.all(
      notifications.map((notification) =>
        (async () => {
          if (notification.userIds?.length) {
            return await this.userService.getUsersOption({
              options: {
                where: {
                  id: notification.userIds[notification.userIds.length - 1],
                },
                relations: {
                  avatarId: true,
                },
                select: {
                  id: true,
                  name: true,
                  username: true,
                  avatarId: {
                    id: true,
                    cdn: true,
                  },
                },
              },
            })
          }
        })(),
      ),
    )

    return generateResponse(
      {
        notifications: notifications.map((notification, index) => {
          if (notification.userTaget) {
            notification.userTaget.avatarId.cdn = `${process.env.BE_BASE_URL}${notification.userTaget.avatarId.cdn}`
          }

          if (_users[index]) {
            ;(_users[index] as User[])[0].avatarId.cdn = `${
              process.env.BE_BASE_URL
            }${(_users[index] as User[])[0].avatarId.cdn}`
            notification['usersData'] = _users[index]
          }

          return notification
        }),
      },
      {
        count,
        countUnread,
      },
    )
  }

  async getNotification(authorization: string, notificationId: string) {
    const { id }: AccessData = await this.jwtService.verifyAsync(
      getBearerToken(authorization),
    )
    const notification = await this.notificationRepository.findOne({
      where: {
        id: notificationId,
        user: {
          id,
        },
      },
      relations: {
        post: true,
        userTaget: {
          avatarId: true,
        },
      },
      select: {
        post: {
          id: true,
        },
        userTaget: {
          id: true,
          avatarId: {
            id: true,
            cdn: true,
          },
          name: true,
          username: true,
        },
      },
    })

    if (notification.userTaget) {
      notification.userTaget.avatarId.cdn = `${process.env.BE_BASE_URL}${notification.userTaget.avatarId.cdn}`
    }

    if (notification.userIds && notification.userIds.length) {
      const [user] = await this.userService.getUsersOption({
        options: {
          where: {
            id: notification.userIds[notification.userIds.length - 1],
          },
          relations: {
            avatarId: true,
          },
          select: {
            id: true,
            name: true,
            username: true,
            avatarId: {
              id: true,
              cdn: true,
            },
          },
        },
      })

      ;(user as User).avatarId.cdn = `${process.env.BE_BASE_URL}${
        (user as User).avatarId.cdn
      }`
      notification['usersData'] = [user]
    }

    return notification
  }

  async readNotification(authorization: string, notificationId: string) {
    const { id }: AccessData = await this.jwtService.verifyAsync(
      getBearerToken(authorization),
    )
    const notification = await this.notificationRepository.findOne({
      where: {
        id: notificationId,
        user: {
          id,
        },
      },
    })

    if (!notification) throw new NotFoundException()
    if (notification.isRead) throw new BadRequestException()

    notification.isRead = true
    return await this.notificationRepository.update(notification.id, {
      isRead: true,
    })
  }

  async deleteNotification(authorization: string, notificationId: string) {
    const { id }: AccessData = await this.jwtService.verifyAsync(
      getBearerToken(authorization),
    )
    const notification = await this.notificationRepository.findOneBy({
      id: notificationId,
      user: {
        id,
      },
    })

    await this.notificationRepository.remove(notification)
    return
  }

  async newRequestFriend(userId: string, userIdRequest: string) {
    const notification = new Notification()
    notification.type = NotificationType.NEW_REQUEST_FRIEND
    notification.user = { id: userId } as User
    notification.userTaget = { id: userIdRequest } as User
    await this.notificationRepository.save(notification)

    this.emitNew(userId, notification.id)
    return notification
  }

  async acceptedRequestFriend(userId: string, userActionId: string) {
    const notification = new Notification()
    notification.user = { id: userId } as User
    notification.userTaget = { id: userActionId } as User
    notification.type = NotificationType.USER_ACCEPTED_REQUEST_FRIEND

    this.emitNew(userId, notification.id)
    return await this.notificationRepository.save(notification)
  }

  async likePost(postId: string, userActionId: string) {
    const [post] = await this.postService.getPostOptions({
      options: {
        where: {
          id: postId,
        },
        relations: {
          user: true,
        },

        select: {
          id: true,
          user: {
            id: true,
          },
        },
      },
    })

    const userId = post.user.id
    if (userId === userActionId) return
    const notification = await this.notificationRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        post: {
          id: postId,
        },
        type: NotificationType.LIKE_MY_POST,
      },
    })
    if (notification) {
      if (notification.userIds.includes(userActionId)) return

      notification.userIds.push(userActionId)
      await this.notificationRepository.save(notification)
      this.emitUpdate(userId, notification.id)
      return
    }
    const newNotification = new Notification()
    newNotification.user = { id: userId } as User
    newNotification.post = { id: postId } as Post
    newNotification.type = NotificationType.LIKE_MY_POST
    newNotification.userIds = [userActionId]

    await this.notificationRepository.save(newNotification)
    this.emitNew(userId, newNotification.id)
    return
  }

  async likeComment(commentId: number, userActionId: string) {
    const [{ userId, postId }] = await this.dataSource.query(
      `SELECT userId, postId FROM comment WHERE id = ${commentId}`,
    )

    if (userId === userActionId) return

    const notification = await this.notificationRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        post: {
          id: postId,
        },
        type: NotificationType.LIKE_MY_COMMENT,
      },
    })

    if (notification) {
      notification.userIds = notification.userIds.filter(
        (id) => id !== userActionId,
      )
      notification.userIds.push(userActionId)

      await this.notificationRepository.save(notification)
      this.emitUpdate(userId, notification.id)
      return
    }

    const newNotification = new Notification()
    newNotification.user = { id: userId } as User
    newNotification.post = { id: postId } as Post
    newNotification.type = NotificationType.LIKE_MY_COMMENT
    newNotification.userIds = [userActionId]

    await this.notificationRepository.save(newNotification)
    this.emitNew(userId, newNotification.id)
    return
  }

  async commentPost(postId: string, userActionId: string) {
    const [port] = await this.postService.getPostOptions({
      options: {
        where: {
          id: postId,
        },
        relations: {
          user: true,
        },
        select: {
          id: true,
          user: {
            id: true,
          },
        },
      },
    })

    const userId = port.user.id
    if (userId === userActionId) return

    const notification = await this.notificationRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        type: NotificationType.USER_COMMENTED_MY_POST,
        post: {
          id: postId,
        },
      },
    })
    if (notification) {
      notification.userIds = notification.userIds.filter(
        (id) => id !== userActionId,
      )
      notification.userIds.push(userActionId)
      await this.notificationRepository.save(notification)
      this.emitUpdate(userId, notification.id)
      return
    }
    const newNotification = new Notification()
    newNotification.user = { id: userId } as User
    newNotification.post = { id: postId } as Post
    newNotification.type = NotificationType.USER_COMMENTED_MY_POST
    newNotification.userIds = [userActionId]
    await this.notificationRepository.save(newNotification)
    this.emitNew(userId, newNotification.id)
    return
  }

  async newPostFromFriend(
    userId: string, // post owner
    postId: string,
  ) {
    const ids = await this.friendService.getIdsFriendOfUser(userId)
    if (ids.length === 0) return
    const notifications = ids.map((id) => {
      const notification = new Notification()
      notification.user = { id } as User
      notification.post = { id: postId } as Post
      notification.type = NotificationType.NEW_POST_FROM_FRIEND
      notification.userTaget = { id: userId } as User
      return notification
    })
    await this.notificationRepository.save(notifications)
    notifications.forEach((notification) => {
      this.emitNew(notification.user.id, notification.id)
    })
  }

  emitNew(userId: string, notificationId: string) {
    this.socketService.socket.emit(`notification-${userId}-new`, notificationId)
  }

  emitUpdate(userId: string, notificationId: string) {
    this.socketService.socket.emit(
      `notification-${userId}-update`,
      notificationId,
    )
  }
}
