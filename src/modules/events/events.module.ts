import { Global, Module } from '@nestjs/common'
import { EventsGateway } from './events.gateway'
import { SocketModule } from '../socket/socket.module'

@Global()
@Module({
  providers: [EventsGateway],
  exports: [EventsGateway],
  imports: [SocketModule],
})
export class EventsModule {}
