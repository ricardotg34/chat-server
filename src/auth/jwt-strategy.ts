import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { WsException } from '@nestjs/websockets';

interface JwtPayload {
  id: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'topSecret51'
    });
  }

  async validate(payload: JwtPayload): Promise<UserDocument> {
    const { id } = payload;
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

@Injectable()
export class WSJwtStrategy extends PassportStrategy(Strategy, 'ws-jwt') {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'topSecret51'
    });
  }

  async validate(payload: JwtPayload): Promise<UserDocument> {
    const { id } = payload;
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new WsException('Unauthorized.');
    }
    return user;
  }
}
