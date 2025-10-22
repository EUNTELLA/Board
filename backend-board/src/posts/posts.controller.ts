/**
 * PostsController
 *
 * 게시글 관련 HTTP 엔드포인트를 정의하는 컨트롤러
 * RESTful API 패턴을 따라 게시글 CRUD 및 댓글 기능 제공
 *
 * Base URL: /posts
 */

import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('posts')  // 라우트 prefix: /posts
export class PostsController {
  /**
   * 생성자 - PostsService 의존성 주입
   * NestJS의 DI(Dependency Injection) 시스템을 통해 자동으로 주입됨
   */
  constructor(private readonly postsService: PostsService) { }

  /**
   * 댓글 추가
   *
   * POST /posts/:id/comments
   *
   * @param id - 게시글 ID (URL 파라미터)
   * @param commentData - 댓글 내용 (요청 본문)
   * @returns 업데이트된 게시글 객체 (댓글 포함)
   *
   */

  @Post(':id/comments')
  async addComment(
    @Param('id') id: string,
    @Body() commentData: CreateCommentDto,
  ) {
    return this.postsService.addComment(id, commentData);
  }

  /**
   * 게시글 목록 조회 (페이지네이션 + 검색 + 정렬)
   *
   * GET /posts?page=1&limit=10&search=keyword&sort=latest
   *
   * @param page - 페이지 번호 (기본값: 1)
   * @param limit - 페이지당 게시글 수 (기본값: 10)
   * @param search - 검색 키워드 (제목, 내용, 작성자 검색)
   * @param sort - 정렬 기준 (latest: 최신순, views: 조회수순, comments: 댓글순)
   * @returns { posts: Post[], currentPage: number, totalPages: number }
   *
   * 예시 요청:
   * GET /posts?page=1&limit=10&search=React&sort=latest
   *
   * 응답 형식:
   * {
   *   posts: [{ _id, title, content, author, views, comments, createdAt }],
   *   currentPage: 1,
   *   totalPages: 5
   * }
   */
  @Get()
  async getPosts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string = '',
    @Query('sort') sort: string = 'latest',
  ) {
    return this.postsService.findAll(page, limit, search, sort);
  }
  /**
   * 게시글 상세 조회
   *
   * GET /posts/:id
   *
   * @param id - 게시글 ID (URL 파라미터)
   * @returns 게시글 객체 (댓글 포함)
   *
   * 동작:
   * - 게시글 조회 시 자동으로 조회수(views) 1 증가
   * - 댓글 목록 포함하여 반환
   *
   * 예시 요청:
   * GET /posts/507f1f77bcf86cd799439011
   *
   * 응답 형식:
   * {
   *   _id: "507f1f77bcf86cd799439011",
   *   title: "게시글 제목",
   *   content: "게시글 내용",
   *   author: "작성자명",
   *   authorId: "123",
   *   views: 42,
   *   comments: [{ content, author, createdAt }],
   *   createdAt: "2025-01-15T10:30:00Z",
   *   updatedAt: "2025-01-15T10:30:00Z"
   * }
   */
  @Get(':id')
  async getPostById(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  /**
   * 게시글 생성
   *
   * POST /posts
   *
   * @param postData - 게시글 데이터 (요청 본문)
   * @returns 생성된 게시글 객체
   *
   * 예시 요청:
   * POST /posts
   * Body: {
   *   "title": "새 게시글",
   *   "content": "게시글 내용",
   *   "author": "John",
   *   "authorId": "123"
   * }
   */
  @Post()
  async createPost(@Body() postData: CreatePostDto) {
    return this.postsService.create(postData);
  }

  /**
   * 게시글 수정
   *
   * PATCH /posts/:id
   *
   * @param id - 게시글 ID (URL 파라미터)
   * @param postData - 수정할 데이터 (일부 필드만 포함 가능)
   * @returns 업데이트된 게시글 객체
   *
   * 권한:
   * - 작성자 본인만 수정 가능 (Service 레이어에서 검증)
   *
   * 예시 요청:
   * PATCH /posts/507f1f77bcf86cd799439011
   * Body: {
   *   "title": "수정된 제목",
   *   "content": "수정된 내용"
   * }
   */
  @Patch(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() postData: Partial<CreatePostDto>,
  ) {
    return this.postsService.update(id, postData);
  }

  /**
   * 게시글 삭제
   *
   * DELETE /posts/:id
   *
   * @param id - 게시글 ID (URL 파라미터)
   * @returns 삭제된 게시글 정보
   *
   * 권한:
   * - 작성자 본인만 삭제 가능 (Service 레이어에서 검증)
   *
   * 예시 요청:
   * DELETE /posts/507f1f77bcf86cd799439011
   */
  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    return this.postsService.delete(id);
  }
}

