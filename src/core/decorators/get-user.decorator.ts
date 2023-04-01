import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/auth/schemas/user.schema';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  }
);

export const WSGetUser = createParamDecorator(
  (data, ctx: ExecutionContext): User => {
    const req = ctx.switchToWs().getClient().handshake;
    return req.user;
  }
);
