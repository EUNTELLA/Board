// 필요한 데코레이터들을 @nestjs/common에서 모두 import합니다.
import { Controller, Get, Post, Body, Param, Patch, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts') // '/posts' 경로로 들어오는 모든 요청을 이 컨트롤러가 담당합니다.
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  // GET /posts?page=1&limit=10 - 게시글 목록 조회
  @Get()
  getPosts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.postsService.findAll({ page, limit });
  }

  // GET /posts/:id - 특정 게시글 하나 조회
  @Get(':id')
  // ParseIntPipe는 URL에서 받은 id 파라미터(문자열)를 숫자(number)로 자동 변환해줍니다.
  getPostById(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  // POST /posts - 새 게시글 생성
  @Post()
  // @Body() 데코레이터는 요청의 본문(body)에 담겨 온 JSON 데이터를 가져옵니다.
  createPost(@Body() postData: CreatePostDto) {
    return this.postsService.create(postData);
  }

  // PATCH /posts/:id - 특정 게시글 수정
  @Patch(':id')
  updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() postData: Partial<CreatePostDto>, // Partial<>은 title, content 중 일부만 올 수 있음을 의미합니다.
  ) {
    return this.postsService.update(id, postData);
  }

  // DELETE /posts/:id - 특정 게시글 삭제
  @Delete(':id')
  deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.delete(id);
  }
}

