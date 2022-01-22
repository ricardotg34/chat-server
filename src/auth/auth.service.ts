import {
  BadRequestException,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/User.schema';
import {
  AuthCredentialsDto,
  AuthCredentialsResponseDto
} from './dto/auth-credentialsdto';

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

  async validatePassword({
    email,
    password
  }: AuthCredentialsDto): Promise<AuthCredentialsResponseDto> {
    try {
      const user = await this.userModel.findOne({ email });
      if (user && bcrypt.hashSync(password, 10) === user.password) {
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
    const payload = { user: user.email };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}
