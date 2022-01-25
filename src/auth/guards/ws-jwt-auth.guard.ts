import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { IS_PUBLIC_KEY } from 'src/core/decorators/is-public.decorator';
import { AuthService } from '../auth.service';

@Injectable()
export class WSJwtAuthGuard extends AuthGuard('ws-jwt') {
  constructor(
    private reflector: Reflector,
    private readonly authService: AuthService
  ) {
    super();
  }

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    if (isPublic) {
      return true;
    }
    const client: Socket = context.switchToWs().getClient();
    const token = client.handshake.headers.authorization?.replace(
      'Bearer ',
      ''
    );
    const verified = this.authService.verifyToken(token);
    if (verified) {
      return super.canActivate(context);
    } else {
      client.disconnect();
      return false;
    }
  }

  getRequest(context: ExecutionContext) {
    return context.switchToWs().getClient().handshake;
  }
  // // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  // handleRequest(err: unknown, user: User): any {
  //   if (err || !user) {
  //     throw err || new UnauthorizedException('You are not allowed to see this info');
  //   }
  //   return user;
  // }
}
