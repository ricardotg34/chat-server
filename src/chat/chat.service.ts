import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class ChatService {
  constructor(private authService: AuthService) {}

  async toggleUserConnectionState(authHeader: string, isOnline: boolean) {
    const token = authHeader.replace('Bearer ', '');
    const user = await this.authService.verifyToken(token);
    this.authService.toggleConnectionState(user.id, isOnline);
    return user;
  }
}
