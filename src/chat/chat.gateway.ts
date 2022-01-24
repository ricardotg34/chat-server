import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: ChatService) {}
  handleConnection(client: Socket) {
    console.log('Cliente conectado');
  }
  handleDisconnect(client: Socket) {
    console.log('Cliente desconectado');
  }
}
