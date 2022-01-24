import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type UserDocument = User & Document;
@Schema()
export class User {
  @ApiProperty({
    description: 'email that identifies the user.',
    example: 'mayrasho',
    type: String
  })
  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @ApiProperty({
    description: 'Name of the user.',
    example: 'Mayra',
    type: String
  })
  @Prop()
  name: string;
}

const UserSchema = SchemaFactory.createForClass(User);

export { UserSchema };
