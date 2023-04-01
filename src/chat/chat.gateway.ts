import { UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WSJwtAuthGuard } from 'src/auth/guards/ws-jwt-auth.guard';
import { ChatService } from './chat.service';
import { GetMessageDTO } from './dto/get-message.dto';

@WebSocketGateway({
  namespace: 'chat'
})
@UseGuards(WSJwtAuthGuard)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  async handleConnection(client: Socket) {
    const user = await this.chatService.toggleUserConnectionState(
      client.handshake.headers.authorization,
      true
    );
    client.join(user.id);
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

  @SubscribeMessage('personal-message')
  getPersonalMessage(@MessageBody() data: GetMessageDTO) {
    this.server.to(data.to).emit('personal-message', data);
  }
}
