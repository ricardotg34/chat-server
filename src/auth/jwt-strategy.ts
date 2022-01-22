import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/User.schema';
import { InjectModel } from '@nestjs/mongoose';

interface JwtPayload {
  username: string;
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
    const { username } = payload;
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
