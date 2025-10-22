import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }


  @Post(':id/comments')
  async addComment(
    @Param('id') id: string,

    @Body() commentData: CreateCommentDto,
  ) {
    return this.postsService.addComment(id, commentData);
  }


  @Get()
  async getPosts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string = '',
    @Query('sort') sort: string = 'latest',
  ) {
    return this.postsService.findAll(page, limit, search, sort);
  }

  @Get(':id')
  async getPostById(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Post()
  async createPost(@Body() postData: CreatePostDto) {
    return this.postsService.create(postData);
  }

  @Patch(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() postData: Partial<CreatePostDto>,
  ) {
    return this.postsService.update(id, postData);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    return this.postsService.delete(id);
  }
}

