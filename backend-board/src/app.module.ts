// backend-board/src/app.module.ts

import { Module } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [PostsModule], // We will import the Posts feature here
  controllers: [],
  providers: [],
})
export class AppModule {}