import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = HydratedDocument<User>;
@Schema({
  toJSON: {
    transform: (
      doc: Record<string, unknown>,
      ret: Record<string, unknown>
    ): any => {
      const { _id, ...rest } = ret;
      delete rest.password;
      return { id: _id, ...rest };
    }
  }
})
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

  @ApiProperty({
    description: 'Online user status.',
    example: true,
    type: Boolean
  })
  @Prop({ default: false })
  isOnline: boolean;
}

const UserSchema = SchemaFactory.createForClass(User);

export { UserSchema };
