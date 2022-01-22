import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Unique email',
    example: 'user@example.com',
    type: String
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description:
      'A password that must have at least one Uppercase letter and at least one numerical Character, with a length between 8 and 20.',
    example: 'Passwordexample1',
    type: String
  })
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak'
  })
  password: string;

  @ApiProperty({
    description: 'Name of the user',
    example: 'Giselle',
    type: String
  })
  @IsNotEmpty()
  name: string;
}
