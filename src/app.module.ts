import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://ricardotg34:kirisutegomen@clustertg.n0miq.mongodb.net/chat',
      { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
    ),
    AuthModule
  ]
})
export class AppModule {}
