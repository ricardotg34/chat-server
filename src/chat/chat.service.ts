import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { Message, MessageDocument } from './schemas/message.schema';
import { GetMessageDTO } from './dto/get-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    private authService: AuthService
  ) {}

  async toggleUserConnectionState(authHeader: string, isOnline: boolean) {
    const token = authHeader.replace('Bearer ', '');
    const user = await this.authService.verifyToken(token);
    this.authService.toggleConnectionState(user.id, isOnline);
    return user;
  }

  async saveMessage(messageDto: GetMessageDTO): Promise<Message> {
    try {
      const message = new this.messageModel(messageDto);
      return await message.save();
    } catch (error) {
      throw new WsException('The message cannot be sent');
    }
  }

  async getConversationMessages(
    fromId: string,
    ownerId: string
  ): Promise<Message[]> {
    const last30Messages = await this.messageModel
      .find({
        $or: [
          { from: ownerId, to: fromId },
          { from: fromId, to: ownerId }
        ]
      })
      .sort({ createdAt: 'desc' })
      .limit(30);
    return last30Messages;
  }
}
