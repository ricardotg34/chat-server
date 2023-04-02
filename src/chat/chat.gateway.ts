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
import { WSGetUser } from 'src/core/decorators/get-user.decorator';
import { ChatService } from './chat.service';
import { GetMessageDTO } from './dto/get-message.dto';
import { UserDocument } from 'src/auth/schemas/user.schema';

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
  async getPersonalMessage(
    @WSGetUser() user: UserDocument,
    @MessageBody() data: GetMessageDTO
  ) {
    await this.chatService.saveMessage({ ...data, from: user.id });
    this.server.to(data.to).emit('personal-message', data);
  }
}
