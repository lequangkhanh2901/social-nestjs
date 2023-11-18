import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { SocketService } from '../socket/socket.service'
import { Inject, forwardRef } from '@nestjs/common'

@WebSocketGateway(4001, {
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  constructor(
    @Inject(forwardRef(() => SocketService))
    private socketService: SocketService,
  ) {}

  @WebSocketServer()
  server: Server

  afterInit(server: Server) {
    this.socketService.socket = server
  }

  @SubscribeMessage('start-call')
  startCall(@MessageBody() data: any) {
    this.server.emit(`want-to-call-${data.conversationId}`)
  }

  @SubscribeMessage('accept-call')
  acceotCall(@MessageBody() conversationId: string) {
    this.server.emit(`user-accepted-${conversationId}`)
  }

  @SubscribeMessage('call-ended')
  callEnded(@MessageBody() conversationId: string) {
    this.server.emit(`call-ended-${conversationId}`)
  }

  @SubscribeMessage('join-room')
  joinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { conversationId, userId },
  ) {
    this.server.emit(`call-${conversationId}`, userId)
    socket.join(conversationId)
    setTimeout(() => {
      socket.broadcast
        .to(conversationId)
        .emit(`user-connected-${conversationId}`, userId)
    }, 1000)

    return {
      event: 'created',
      room: conversationId,
    }
  }
}
