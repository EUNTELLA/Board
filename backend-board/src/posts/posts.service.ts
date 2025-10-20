import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  // 데이터베이스 대신 사용할 메모리 내 게시글 배열
  private posts = Array.from({ length: 25 }, (_, i) => ({
    id: 25 - i,
    title: `Nest.js 더미 데이터 ${25 - i}`,
    content: `이것은 ${25 - i}번째 게시글의 내용입니다.`,
    author: `익명${i + 1}`,
    createdAt: new Date(`2025-10-${19 - (i % 10)}T10:00:00Z`),
  }));
  private nextPostId = 26; // 새 글을 위한 ID 카운터

  // READ (List)
  findAll(query: { page?: number; limit?: number }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = this.posts.slice(startIndex, endIndex);
    const totalPages = Math.ceil(this.posts.length / limit);
    return {
      posts: results,
      currentPage: page,
      totalPages: totalPages,
    };
  }

  // READ (Single)
  findOne(id: number) {
    const post = this.posts.find(p => p.id === id);
    if (!post) {
      throw new NotFoundException(`ID가 ${id}인 게시글을 찾을 수 없습니다.`);
    }
    return post;
  }

  // CREATE
  create(postData: CreatePostDto) {
    const newPost = {
      id: this.nextPostId++,
      ...postData,
      createdAt: new Date(),
    };
    this.posts.unshift(newPost); // 새 글을 맨 앞에 추가
    return newPost;
  }

  // UPDATE
  update(id: number, postData: Partial<CreatePostDto>) {
    const post = this.findOne(id); // findOne을 재사용하여 게시글을 찾습니다.
    // 찾은 게시글 객체에 새로운 데이터를 덮어씌웁니다.
    Object.assign(post, postData);
    return post;
  }

  // DELETE
  delete(id: number) {
    const postIndex = this.posts.findIndex(p => p.id === id);
    if (postIndex === -1) {
      throw new NotFoundException(`ID가 ${id}인 게시글을 찾을 수 없습니다.`);
    }
    this.posts.splice(postIndex, 1);
    return { message: `ID ${id} 게시글이 삭제되었습니다.` };
  }
}

