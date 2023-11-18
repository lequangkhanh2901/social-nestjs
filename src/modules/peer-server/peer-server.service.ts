import { Injectable } from '@nestjs/common'
import * as Peer from 'peer'

@Injectable()
export class PeerServerService {
  private readonly peerServer: any
  private readonly activeConnections: Map<string, any>

  constructor() {
    this.peerServer = Peer.PeerServer()
    this.activeConnections = new Map()

    this.peerServer.on('connection', (conn) => {
      this.handleConnection(conn)
    })
  }

  getPeerServer() {
    return this.peerServer
  }

  private handleConnection(conn) {
    const peerId = conn.peer
    this.activeConnections.set(peerId, conn)

    conn.on('data', () => {
      // Handle data (you can send signaling messages for WebRTC here)
    })

    conn.on('close', () => {
      this.activeConnections.delete(peerId)
    })
  }

  sendSignal(peerId: string, data: any) {
    const conn = this.activeConnections.get(peerId)
    if (conn) {
      conn.send(data)
    }
  }
}
