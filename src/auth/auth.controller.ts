import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Get,
  UseGuards,
  HttpCode
} from '@nestjs/common';
import {
  ApiTags,
  ApiExtraModels,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiBearerAuth
} from '@nestjs/swagger';
import { ResponseDtoSchema } from 'src/core/api-schemas/response-dto.schema';
import { GetUser } from 'src/core/decorators/get-user.decorator';
import { ResponseDto } from 'src/core/dto/response.dto';
import { AuthService } from './auth.service';
import {
  AuthCredentialsDto,
  AuthCredentialsResponseDto
} from './dto/auth-credentialsdto';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User, UserDocument } from './schemas/user.schema';

// yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZ2lzc0BleGFtcGxlLmNvbSIsImlkIjoiNjFlYjdkNWMwNjc3ZDExNzk5OTFmNzJkIiwiaWF0IjoxNjQzMjA0NDI2LCJleHAiOjE2NDMyOTA4MjZ9.I3AulS0op0N1vS53PNiZTiHQ2Rd_dFjaVCZLrhlQOnk

@Controller('users')
@ApiTags('Auth and Users')
@ApiExtraModels(ResponseDto, AuthCredentialsResponseDto, User)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @UsePipes(ValidationPipe)
  @ApiCreatedResponse({
    description: 'The user has been successfully created.'
  })
  @ApiBadRequestResponse({ description: 'The user already exists.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })
  async create(@Body() user: CreateUserDto): Promise<ResponseDto> {
    await this.authService.create(user);
    return new ResponseDto(201, 'The user has been created.');
  }

  @Get()
  @ApiCreatedResponse({
    description: 'Users have been successfuly retreived.'
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async list(@GetUser() user: UserDocument): Promise<ResponseDto<User[]>> {
    return new ResponseDto(200, await this.authService.list(user));
  }

  @Post('sign-in')
  @HttpCode(200)
  @UsePipes(ValidationPipe)
  @ApiOkResponse({
    description: 'User successfuly authenticated.',
    schema: new ResponseDtoSchema(AuthCredentialsResponseDto)
  })
  @ApiBadRequestResponse({
    description: 'Either the username or the password is not valid.'
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })
  async login(
    @Body() credentials: AuthCredentialsDto
  ): Promise<ResponseDto<AuthCredentialsResponseDto>> {
    return new ResponseDto(
      200,
      await this.authService.validatePassword(credentials),
      'User authenticated'
    );
  }

  @Get('renew-token')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async renew(
    @GetUser() user: UserDocument
  ): Promise<ResponseDto<AuthCredentialsResponseDto>> {
    return new ResponseDto(200, await this.authService.renewToken(user));
  }
}
