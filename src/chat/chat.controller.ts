import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserDocument } from 'src/auth/schemas/user.schema';
import { GetUser } from 'src/core/decorators/get-user.decorator';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ResponseDto } from 'src/core/dto/response.dto';
import { Message } from './schemas/message.schema';

@Controller('chat')
export class ChatController {
  constructor(private readonly chastService: ChatService) {}

  @Get('conversation/:from')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getConversationMessages(
    @Param('from') fromId: string,
    @GetUser() user: UserDocument
  ): Promise<ResponseDto<Message[]>> {
    return new ResponseDto(
      200,
      await this.chastService.getConversationMessages(fromId, user.id)
    );
  }
}
