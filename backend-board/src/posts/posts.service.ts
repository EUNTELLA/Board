// 게시글 비즈니스 로직 

import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class PostsService implements OnModuleInit {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) { }

  async onModuleInit() {
    await this.seedDatabase();
  }


  private async seedDatabase() {
    const postCount = await this.postModel.countDocuments().exec();
    if (postCount === 0) {
      console.log('데이터베이스가 비어있습니다. 더미 데이터를 생성합니다...');

      const sampleTitles = [
        'React Hooks, 이렇게 사용하면 좋습니다', 'NestJS로 만드는 실시간 채팅 서버', 'FastAPI와 Pydantic 완전 정복',
        'TypeScript 제네릭, 언제 사용해야 할까?', 'Ollama 로컬 모델 성능 비교 (Llama3 vs Phi-3)', 'MongoDB Aggregation 파이프라인 실전 예제',
        '프론트엔드 상태 관리, Zustand가 대세?', 'CSS-in-JS 라이브러리 전격 비교', 'Docker를 활용한 개발 환경 구축 가이드',
        'Clean Architecture, 백엔드에 적용하기', 'GenAI를 활용한 코드 자동 생성기 만들기', 'Mongoose 스키마 디자인 أفضل الممارسات',
        'Next.js 14 서버 컴포넌트 심층 분석', 'Tailwind CSS 커스터마이징 꿀팁', 'Bun vs Node.js 성능 벤치마크'
      ];
      const sampleAuthors = ['김개발', '이코딩', '박주니어', '최시니어', '정엔지니어', '윤디자인'];
      const sampleContents = [
        '최근 프로젝트를 진행하면서 느낀 점들을 공유합니다. 이 방법은 특히 대규모 애플리케이션에서 유용했습니다.',
        '많은 분들이 어려워하는 개념이지만, 몇 가지 핵심 원칙만 이해하면 쉽게 적용할 수 있습니다. 예제 코드를 통해 알아봅시다.',
        '성능 최적화를 위해 고려해야 할 몇 가지 사항들이 있습니다. 브라우저 렌더링 과정을 이해하는 것이 중요합니다.',
        '이 라이브러리의 공식 문서는 약간 불친절한 면이 있어서, 제가 직접 부딪히며 배운 내용들을 정리해봤습니다.',
        '초보자분들이 흔히 하는 실수와 그것을 방지하는 방법에 대해 이야기해 보겠습니다. 이 글이 여러분의 시간을 아껴줄 겁니다.',
      ];
      const sampleComments = [
        { author: '공감봇', content: '와, 정말 유용한 정보네요! 감사합니다.' },
        { author: '질문요정', content: '혹시 이 부분에 대해서 조금 더 자세히 설명해주실 수 있나요?' },
        { author: '지나가던개발자', content: '좋은 글 잘 보고 갑니다~' },
        { author: '딴지대마왕', content: '저는 좀 다른 의견인데, 이 방법은 이런 단점이 있을 것 같아요.' },
        { author: '리액트고수', content: '이런 방법도 한번 고려해보세요! 훨씬 효율적일 수 있습니다.' },
      ];

      const postsToCreate = Array.from({ length: 52 }, (_, i) => {
        const postDate = new Date();
        postDate.setDate(postDate.getDate() - Math.floor(i / 2));

        const comments = [];
        const commentCount = Math.floor(Math.random() * 5); // 0~4개의 댓글 랜덤 생성
        for (let j = 0; j < commentCount; j++) {
          const comment = sampleComments[j % sampleComments.length];
          const commentDate = new Date(postDate);
          commentDate.setHours(commentDate.getHours() + j + 1);
          comments.push({ ...comment, createdAt: commentDate, updatedAt: commentDate });
        }

        return {
          title: `${sampleTitles[i % sampleTitles.length]} #${Math.floor(i / 5) + 1}`,
          author: sampleAuthors[i % sampleAuthors.length],
          content: `${i + 1}번째 게시글입니다. ${sampleContents[i % sampleContents.length]}`,
          views: Math.floor(Math.random() * 1500),
          createdAt: postDate,
          updatedAt: postDate,
          comments,
        };
      });

      await this.postModel.insertMany(postsToCreate);
      console.log('✅ 52개의 더미 게시글과 댓글 생성을 완료했습니다!');
    }
  }


  // 댓글 추가 
  async addComment(postId: string, commentData: CreateCommentDto): Promise<Post> {
    const post = await this.findOne(postId);
    post.comments.push(commentData as any);
    await post.save();
    return post;
  }

  async findAll(page: number = 1, limit: number = 10, search: string = '', sort: string = 'latest') {
    const skip = (page - 1) * limit;
    //검색 필터 : 제목, 내용, 작성자에서 검색 
    const filter = search ? {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ]
    } : {};

    // 정렬 옵션 설정
    let sortOption: any = { createdAt: -1 }; // 기본: 최신순
    if (sort === 'popular') {
      sortOption = { views: -1 }; // 조회수 많은 순
    } else if (sort === 'comments') {
      // 댓글 많은 순 (comments 배열 길이로 정렬하기 위해 aggregate 사용)
      const posts = await this.postModel.aggregate([
        { $match: filter },
        { $addFields: { commentCount: { $size: '$comments' } } },
        { $sort: { commentCount: -1 } },
        { $skip: skip },
        { $limit: limit }
      ]).exec();

      const totalPosts = await this.postModel.countDocuments(filter).exec();
      const totalPages = Math.ceil(totalPosts / limit);
      return { posts, currentPage: page, totalPages };
    }

    const [posts, totalPosts] = await Promise.all([
      this.postModel.find(filter).sort(sortOption).skip(skip).limit(limit).exec(),
      this.postModel.countDocuments(filter).exec(),
    ]);
    const totalPages = Math.ceil(totalPosts / limit);
    return { posts, currentPage: page, totalPages };
  }

  async findOne(id: string): Promise<PostDocument> {
    const post = await this.postModel.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true }).exec();
    if (!post) throw new NotFoundException(`ID가 ${id}인 게시글을 찾을 수 없습니다.`);
    return post;
  }

  async create(postData: CreatePostDto): Promise<Post> {
    const createdPost = new this.postModel(postData);
    return createdPost.save();
  }

  async update(id: string, postData: Partial<CreatePostDto>): Promise<Post> {
    const updatedPost = await this.postModel.findByIdAndUpdate(id, postData, { new: true }).exec();
    if (!updatedPost) throw new NotFoundException(`ID가 ${id}인 게시글을 찾을 수 없습니다.`);
    return updatedPost;
  }

  async delete(id: string) {
    const result = await this.postModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`ID가 ${id}인 게시글을 찾을 수 없습니다.`);
    return { message: `ID ${id} 게시글이 삭제되었습니다.` };
  }
}