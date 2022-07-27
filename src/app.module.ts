import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public')
    }),
    MongooseModule.forRoot(
      'mongodb+srv://chat_user:09100209@clustertg.n0miq.mongodb.net/chat?retryWrites=true&w=majority'
    ),
    AuthModule,
    ChatModule
  ]
})
export class AppModule {}
