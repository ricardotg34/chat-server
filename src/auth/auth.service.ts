import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import {
  AuthCredentialsDto,
  AuthCredentialsResponseDto
} from './dto/auth-credentialsdto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService
  ) {}

  async create(userDto: CreateUserDto): Promise<User> {
    try {
      const { password, ...userInfo } = userDto;
      const user = new this.userModel({
        password: bcrypt.hashSync(password, 10),
        ...userInfo
      });
      return await user.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          `The user ${userDto.email} already exist.`
        );
      }
      throw new InternalServerErrorException();
    }
  }

  async list(user: UserDocument): Promise<User[]> {
    try {
      const users = await this.userModel
        .find({ _id: { $ne: user?.id } })
        .sort('-online');
      return users;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async toggleConnectionState(userId: string, connectionState: boolean) {
    try {
      const user = await this.userModel.findById(userId);
      if (!user)
        throw new NotFoundException(
          `The User with id ${userId} does not exist.`
        );
      user.isOnline = connectionState;
      user.save();
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      else throw new InternalServerErrorException();
    }
  }

  async validatePassword({
    email,
    password
  }: AuthCredentialsDto): Promise<AuthCredentialsResponseDto> {
    try {
      const user = await this.userModel.findOne({ email });
      if (user && bcrypt.compareSync(password, user.password)) {
        return await this.renewToken(user);
      } else {
        throw new BadRequestException(
          'Either the username or the password is not valid.'
        );
      }
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      else throw new InternalServerErrorException();
    }
  }

  async renewToken(user: UserDocument): Promise<AuthCredentialsResponseDto> {
    const payload = { email: user.email, id: user.id, name: user.name };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken, username: user.name };
  }

  async verifyToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userModel.findById(payload.id);
      if (!user) throw new UnauthorizedException();
      return user;
    } catch {
      return undefined;
    }
  }
}
