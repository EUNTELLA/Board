import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    // 1. .env 파일을 사용하기 위한 ConfigModule 설정
    ConfigModule.forRoot({
      isGlobal: true, // 모든 모듈에서 process.env 사용 가능
    }),
    // 2. MongoDB 연결 설정
    MongooseModule.forRoot(process.env.MONGODB_URI),
    PostsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
