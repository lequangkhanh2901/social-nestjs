import { Module } from '@nestjs/common'
import { PeerServerController } from './peer-server.controller'
import { PeerServerService } from './peer-server.service'

@Module({
  controllers: [PeerServerController],
  providers: [PeerServerService],
})
export class PeerServerModule {}
