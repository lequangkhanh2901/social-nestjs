import { Global, Module, forwardRef } from '@nestjs/common'
import { EventsGateway } from './events.gateway'
import { SocketModule } from '../socket/socket.module'

@Global()
@Module({
  providers: [EventsGateway],
  exports: [EventsGateway],
  imports: [forwardRef(() => SocketModule)],
})
export class EventsModule {}
