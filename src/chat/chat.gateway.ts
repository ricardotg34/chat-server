import { UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { WSJwtAuthGuard } from 'src/auth/guards/ws-jwt-auth.guard';
import { ChatService } from './chat.service';

@WebSocketGateway({
  namespace: 'chat'
})
@UseGuards(WSJwtAuthGuard)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private chatService: ChatService) {}

  async handleConnection(client: Socket) {
    this.chatService.toggleUserConnectionState(
      client.handshake.headers.authorization,
      true
    );
  }

  async handleDisconnect(client: Socket) {
    this.chatService.toggleUserConnectionState(
      client.handshake.headers.authorization,
      false
    );
  }

  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string): string {
    return data;
  }
}
