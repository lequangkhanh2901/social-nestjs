import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'
import { SocketService } from '../socket/socket.service'

@WebSocketGateway(4001, {
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  constructor(private socketService: SocketService) {}

  @WebSocketServer()
  server: Server

  afterInit(server: Server) {
    this.socketService.socket = server
  }

  // @SubscribeMessage('events')
  // findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
  //   return from([1, 2, 3]).pipe(
  //     map((item) => ({ event: 'events', data: item })),
  //   )
  // }

  // @SubscribeMessage('identity')
  // async identity(@MessageBody() data: number): Promise<number> {
  //   return data
  // }

  // @SubscribeMessage('hello')
  // handle(@MessageBody() data: any) {
  //   console.log(data)

  //   this.server.emit(`message-${data.key}`, 'hihihi')

  //   this.some()

  //   return 'Hello you'
  // }

  // some() {
  //   this.server.emit('hi', 'hi from some')
  // }
}
