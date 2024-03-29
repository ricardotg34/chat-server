import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthCredentialsDto {
  @ApiProperty({
    description: 'User email',
    example: 'uase@example.com',
    type: String
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'Password4',
    type: String
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class AuthCredentialsResponseDto {
  @ApiProperty({
    description: 'Access token used to authenticate the user',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    type: String
  })
  accessToken: string;

  @ApiProperty({
    description: 'Username of the authenticated user',
    example: 'Username',
    type: String
  })
  username: string;
}
