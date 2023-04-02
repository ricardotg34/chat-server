import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';

export type MessageDocument = HydratedDocument<Message>;

@Schema({
  toJSON: {
    transform: (
      doc: Record<string, unknown>,
      ret: Record<string, unknown>
    ): any => {
      const { _id, ...rest } = ret;
      return { id: _id, ...rest };
    }
  },
  timestamps: true
})
export class Message {
  @ApiProperty({
    description: 'ID of the user who sends the message.',
    example: 'abcdef',
    type: String
  })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: true })
  from: string;

  @ApiProperty({
    description: 'ID of the user who receives the message.',
    example: 'abcdef',
    type: String
  })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: true })
  to: string;

  @ApiProperty({
    description: 'Message to be sent.',
    example: 'Hi, how is it going?',
    type: String
  })
  @Prop({ required: true })
  message: string;
}

const MessageSchema = SchemaFactory.createForClass(Message);

export { MessageSchema };
