# Eun Board - AI-Powered Bulletin Board System

AI 자연어 검색 기능을 갖춘 풀스택 게시판 애플리케이션입니다.

## 📋 목차

- [프로젝트 개요](#프로젝트-개요)
- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [시스템 아키텍처](#시스템-아키텍처)
- [프론트엔드-백엔드 통신 원리](#프론트엔드-백엔드-통신-원리)
- [설치 및 실행](#설치-및-실행)
- [API 명세](#api-명세)
- [프로젝트 구조](#프로젝트-구조)
- [주요 구현 사항](#주요-구현-사항)
- [개발 환경 설정](#개발-환경-설정)
- [알려진 이슈](#알려진-이슈)
- [향후 개선 계획](#향후-개선-계획)

---

## 🎯 프로젝트 개요

Eun Board는 **Ollama LLM**을 활용한 AI 기반 검색 기능을 제공하는 게시판 시스템입니다. 사용자는 자연어로 질문하여 게시글을 검색할 수 있으며, 전통적인 CRUD 기능도 모두 지원합니다.

### 핵심 특징
- 🤖 **AI 자연어 검색**: "최신 React 게시글 보여줘"와 같은 자연어로 검색 가능
- 🔐 **JWT 인증**: 안전한 사용자 인증 및 권한 관리
- 📱 **반응형 UI**: 모바일 및 데스크톱 최적화
- 🐳 **Docker 컨테이너화**: 손쉬운 배포 및 실행
- 💬 **실시간 댓글**: 게시글별 댓글 기능
- 🔍 **고급 검색**: 제목, 내용, 작성자 검색 및 정렬

---

## ✨ 주요 기능

### 1. 사용자 인증
- 회원가입 / 로그인
- JWT 토큰 기반 인증
- 세션 유지 (localStorage)

### 2. 게시글 관리
- 게시글 작성, 수정, 삭제
- 페이지네이션 (페이지당 10개)
- 조회수 자동 증가
- 작성자 본인만 수정/삭제 가능

### 3. 검색 및 정렬
- 제목, 내용, 작성자 검색
- 최신순, 조회수순, 댓글순 정렬
- 실시간 검색 결과 업데이트

### 4. AI 챗봇 검색
- 자연어 쿼리 처리
- 키워드 자동 추출
- 검색 결과를 카드 형태로 표시
- 대화 이력 관리 (최근 6개)

### 5. 댓글 기능
- 게시글별 댓글 작성
- 댓글 개수 표시
- 작성일 표시

---

## 🛠 기술 스택

### Frontend
- **React** 18.x
- **React Router** - 클라이언트 사이드 라우팅
- **CSS3** - 커스텀 스타일링
- **Fetch API** - HTTP 통신

### Backend - Board
- **NestJS** 10.x - TypeScript 기반 백엔드 프레임워크
- **MongoDB** - NoSQL 데이터베이스
- **Mongoose** - ODM (Object Document Mapping)
- **JWT** - 인증 토큰
- **bcrypt** - 비밀번호 해싱

### Backend - Chatbot
- **FastAPI** - Python 비동기 웹 프레임워크
- **Ollama** - 로컬 LLM 실행 환경
- **phi3:mini** - 경량 LLM 모델 (3.8B 파라미터)
- **httpx** - 비동기 HTTP 클라이언트

### Infrastructure
- **Docker** & **Docker Compose** - 컨테이너 오케스트레이션
- **Nginx** - 리버스 프록시 및 정적 파일 서빙
- **MongoDB** 6.x - 데이터베이스

---

## 🏗 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│                      http://localhost:3000                   │
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Login   │  │  Board   │  │PostDetail│  │ ChatBot  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└───────────────────┬────────────────────────────┬────────────┘
                    │                            │
                    │ HTTP/REST                  │ HTTP/REST
                    ▼                            ▼
        ┌───────────────────────┐    ┌─────────────────────┐
        │  Backend Board        │    │  Backend Chatbot    │
        │  (NestJS)             │    │  (FastAPI)          │
        │  :3001                │◄───┤  :8000              │
        │                       │    │                     │
        │  ┌────────────────┐  │    │  ┌──────────────┐  │
        │  │PostsController │  │    │  │ LLM Service  │  │
        │  │PostsService    │  │    │  │Search Service│  │
        │  │AuthService     │  │    │  └──────────────┘  │
        │  └────────────────┘  │    └──────────┬──────────┘
        └───────────┬───────────┘               │
                    │                           │
                    ▼                           ▼
            ┌───────────────┐         ┌─────────────────┐
            │   MongoDB     │         │  Ollama LLM     │
            │   :27017      │         │  (phi3:mini)    │
            └───────────────┘         │  :11434         │
                                      └─────────────────┘
```

### 데이터 흐름

1. **게시글 목록 조회**
   ```
   User → Frontend → NestJS → MongoDB → NestJS → Frontend
   ```

2. **AI 검색**
   ```
   User → Frontend → FastAPI → Ollama (키워드 추출)
                  ↓
            NestJS → MongoDB (검색)
                  ↓
            FastAPI → Frontend (결과 포맷팅)
   ```

3. **게시글 작성**
   ```
   User → Frontend (JWT) → NestJS → MongoDB
   ```

---

## 🔄 프론트엔드-백엔드 통신 원리

### 1. HTTP 통신 기본 구조

이 프로젝트는 **REST API** 방식으로 프론트엔드와 백엔드가 통신합니다.

```
┌─────────────┐                    ┌─────────────┐
│  Frontend   │   HTTP Request     │  Backend    │
│   (React)   │─────────────────>  │  (NestJS)   │
│  localhost  │                    │  localhost  │
│   :3000     │   HTTP Response    │   :3001     │
│             │<─────────────────  │             │
└─────────────┘                    └─────────────┘
```

### 2. 프론트엔드에서 백엔드 호출 방식

#### 예시 1: 게시글 목록 조회 (GET 요청)

**프론트엔드 코드** (`Board.jsx`):
```javascript
const fetchPosts = async () => {
  // 1. URL 구성
  let url = `http://localhost:3001/posts?page=${currentPage}`;

  // 2. Fetch API로 HTTP GET 요청
  const response = await fetch(url);

  // 3. 응답을 JSON으로 파싱
  const data = await response.json();

  // 4. React state 업데이트 (화면 렌더링)
  setPosts(data.posts);
};
```

**백엔드가 받는 요청**:
```http
GET /posts?page=1 HTTP/1.1
Host: localhost:3001
Accept: application/json
```

**백엔드 코드** (`posts.controller.ts`):
```typescript
@Get()  // GET /posts 경로 매핑
async getPosts(
  @Query('page') page: number = 1  // URL 쿼리 파라미터 추출
) {
  // PostsService에서 데이터베이스 조회
  return this.postsService.findAll(page, limit, search, sort);
}
```

**백엔드 응답**:
```json
{
  "posts": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "게시글 제목",
      "content": "내용...",
      "author": "john"
    }
  ],
  "currentPage": 1,
  "totalPages": 5
}
```

#### 예시 2: 게시글 작성 (POST 요청 + JWT 인증)

**프론트엔드 코드** (`PostForm.jsx`):
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();

  // 1. localStorage에서 JWT 토큰 가져오기
  const token = localStorage.getItem('token');

  // 2. POST 요청 (요청 본문에 데이터 포함)
  const response = await fetch('http://localhost:3001/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`  // JWT 토큰 포함
    },
    body: JSON.stringify({
      title: title,
      content: content
    })
  });

  const data = await response.json();
};
```

**백엔드가 받는 요청**:
```http
POST /posts HTTP/1.1
Host: localhost:3001
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "title": "새 게시글",
  "content": "내용입니다"
}
```

**백엔드 코드** (`posts.controller.ts`):
```typescript
@Post()  // POST /posts 경로 매핑
@UseGuards(JwtAuthGuard)  // JWT 토큰 검증 (인증 필수)
async createPost(@Body() postData: CreatePostDto) {
  // JWT 토큰이 유효하면 게시글 생성
  return this.postsService.create(postData);
}
```

### 3. Docker 환경에서의 통신

#### 개발 환경 (로컬):
```
http://localhost:3000 → Frontend
http://localhost:3001 → Backend Board
http://localhost:8000 → Backend Chatbot
```

#### Docker 환경:
```
http://localhost:3000 → Nginx (Frontend)
                       ↓
                  /api/posts → http://backend-board:3001
                  /api/chat  → http://backend-chatbot:8000
```

**Nginx 리버스 프록시 설정** (`nginx.conf`):
```nginx
server {
    listen 80;

    # React 정적 파일 서빙
    location / {
        root /usr/share/nginx/html;
        try_files $uri /index.html;
    }

    # /api/posts 요청을 NestJS로 전달
    location /api/posts {
        proxy_pass http://backend-board:3001;
    }

    # /api/chat 요청을 FastAPI로 전달
    location /api/chat {
        proxy_pass http://backend-chatbot:8000;
    }
}
```

**이점**:
- 모든 요청이 `localhost:3000`으로 통일됨 (CORS 문제 해결)
- Docker 네트워크 내에서 서비스명으로 통신 가능

### 4. AI 챗봇 검색 통신 흐름 (상세)

```
┌──────────┐         ┌──────────┐         ┌──────────┐         ┌──────────┐
│  User    │         │ Frontend │         │ FastAPI  │         │  NestJS  │
└────┬─────┘         └────┬─────┘         └────┬─────┘         └────┬─────┘
     │                    │                    │                    │
     │ 1. "최신 React 게시글"                   │                    │
     │─────────────────>  │                    │                    │
     │                    │                    │                    │
     │                    │ 2. POST /api/chat  │                    │
     │                    │   Body: {          │                    │
     │                    │     message: "...", │                   │
     │                    │     history: [...]  │                   │
     │                    │   }                 │                   │
     │                    │─────────────────────>                   │
     │                    │                    │                    │
     │                    │                    │ 3. Ollama LLM      │
     │                    │                    │    키워드 추출:     │
     │                    │                    │    "React"         │
     │                    │                    │                    │
     │                    │                    │ 4. GET /posts?search=React
     │                    │                    │─────────────────────>
     │                    │                    │                    │
     │                    │                    │ 5. MongoDB 검색     │
     │                    │                    │<────────────────────
     │                    │                    │   [게시글 배열]      │
     │                    │                    │                    │
     │                    │ 6. Response:       │                    │
     │                    │   {                 │                   │
     │                    │     message: "...", │                   │
     │                    │     posts: [...]    │                   │
     │                    │   }                 │                   │
     │                    │<─────────────────────                   │
     │                    │                    │                    │
     │ 7. 검색 결과 카드    │                    │                    │
     │    표시             │                    │                    │
     │<───────────────────│                    │                    │
     │                    │                    │                    │
```

**단계별 설명**:

1. **사용자 입력**: 자연어로 검색 쿼리 입력
2. **Frontend → FastAPI**: HTTP POST 요청으로 메시지 전송
3. **FastAPI → Ollama**: LLM에 프롬프트 전송하여 키워드 추출
4. **FastAPI → NestJS**: 추출된 키워드로 게시글 검색 요청
5. **NestJS → MongoDB**: 데이터베이스에서 검색 수행
6. **FastAPI → Frontend**: 검색 결과와 자연어 메시지 반환
7. **Frontend**: 사용자에게 결과 표시

### 5. JWT 인증 통신 흐름

```
┌──────────┐         ┌──────────┐         ┌──────────┐
│  User    │         │ Frontend │         │  NestJS  │
└────┬─────┘         └────┬─────┘         └────┬─────┘
     │                    │                    │
     │ 1. 로그인           │                    │
     │   (email, password)│                    │
     │─────────────────>  │                    │
     │                    │                    │
     │                    │ 2. POST /auth/login│
     │                    │─────────────────────>
     │                    │                    │
     │                    │                    │ 3. DB에서 사용자 확인
     │                    │                    │    비밀번호 검증 (bcrypt)
     │                    │                    │
     │                    │ 4. JWT 토큰 발급    │
     │                    │<─────────────────────
     │                    │   { token: "..." }  │
     │                    │                    │
     │                    │ 5. localStorage에   │
     │                    │    토큰 저장        │
     │                    │                    │
     │ 6. 로그인 성공      │                    │
     │<───────────────────│                    │
     │                    │                    │
     │                    │                    │
     │ 7. 게시글 작성      │                    │
     │─────────────────>  │                    │
     │                    │                    │
     │                    │ 8. POST /posts     │
     │                    │    Authorization:   │
     │                    │    Bearer <token>   │
     │                    │─────────────────────>
     │                    │                    │
     │                    │                    │ 9. JWT 토큰 검증
     │                    │                    │    (JwtAuthGuard)
     │                    │                    │
     │                    │ 10. 게시글 생성     │
     │                    │<─────────────────────
     │                    │                    │
     │ 11. 작성 완료       │                    │
     │<───────────────────│                    │
     │                    │                    │
```

### 6. 핵심 통신 개념

#### REST API
- **Representational State Transfer**
- HTTP 메서드를 사용한 CRUD 작업:
  - `GET`: 조회 (Read)
  - `POST`: 생성 (Create)
  - `PATCH/PUT`: 수정 (Update)
  - `DELETE`: 삭제 (Delete)

#### HTTP 요청 구조
```http
[Method] [Path] HTTP/1.1
[Headers]
[빈 줄]
[Body]
```

예시:
```http
POST /posts HTTP/1.1
Host: localhost:3001
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJI...

{"title":"제목","content":"내용"}
```

#### HTTP 응답 구조
```http
HTTP/1.1 [Status Code] [Status Text]
[Headers]
[빈 줄]
[Body]
```

예시:
```http
HTTP/1.1 200 OK
Content-Type: application/json

{"_id":"123","title":"제목","content":"내용"}
```

#### 상태 코드
- `200 OK`: 성공
- `201 Created`: 생성 성공
- `400 Bad Request`: 잘못된 요청
- `401 Unauthorized`: 인증 필요
- `403 Forbidden`: 권한 없음
- `404 Not Found`: 리소스 없음
- `500 Internal Server Error`: 서버 오류

### 7. CORS (Cross-Origin Resource Sharing)

**문제 상황**:
```
Frontend (localhost:3000) → Backend (localhost:3001)
                            ❌ CORS 에러 발생
```

**이유**: 브라우저 보안 정책상 다른 출처(origin)로의 요청을 차단

**해결 방법 1: 백엔드에서 CORS 허용** (NestJS):
```typescript
// main.ts
app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true,
});
```

**해결 방법 2: Nginx 리버스 프록시** (Docker 환경):
- 모든 요청을 `localhost:3000`으로 통일
- Nginx가 내부적으로 백엔드로 프록시

### 8. 비동기 통신 (Async/Await)

**동기 vs 비동기**:

동기 (Synchronous):
```javascript
// ❌ 응답을 받을 때까지 다음 코드 실행 안 됨 (화면 멈춤)
const data = fetchData();  // 5초 걸림
console.log(data);
```

비동기 (Asynchronous):
```javascript
// ✅ 응답을 기다리는 동안 다른 작업 가능 (화면 정상 동작)
const fetchData = async () => {
  const response = await fetch(url);  // 5초 걸림
  const data = await response.json();
  console.log(data);
};
```

**이 프로젝트에서의 활용**:
- Frontend: `async/await` + Fetch API
- Backend (NestJS): `async/await` + Mongoose
- Backend (FastAPI): `async/await` + httpx

### 9. 실제 코드 흐름 예시

**시나리오**: 사용자가 게시글 목록 페이지를 열었을 때

1. **브라우저**: `http://localhost:3000` 접속
2. **Nginx**: React 앱(index.html) 반환
3. **React**: `Board.jsx` 컴포넌트 마운트
4. **useEffect Hook**: 컴포넌트 로드 시 `fetchPosts()` 실행
5. **Fetch API**: `GET http://localhost:3001/posts?page=1` 요청
6. **Nginx**: `/api/posts` 요청을 `backend-board:3001`로 프록시
7. **NestJS Controller**: `@Get()` 핸들러 실행
8. **NestJS Service**: `postsService.findAll()` 실행
9. **Mongoose**: MongoDB에 쿼리 전송
10. **MongoDB**: 게시글 데이터 반환
11. **NestJS**: JSON 응답 생성
12. **Nginx**: 응답을 Frontend로 전달
13. **React**: `setPosts(data.posts)` 실행
14. **브라우저**: 화면에 게시글 목록 렌더링

---

## 🚀 설치 및 실행

### 사전 요구사항

- **Docker Desktop** (권장)
- **Node.js** 18+ (로컬 실행 시)
- **Python** 3.11+ (로컬 실행 시)
- **MongoDB** 6+ (로컬 실행 시)
- **Ollama** (AI 검색 기능 사용 시)

### 1. Docker로 실행 (권장)

```bash
# 1. 저장소 클론
git clone <repository-url>
cd genai

# 2. Ollama 설치 및 모델 다운로드 (호스트 머신에서)
# https://ollama.ai 에서 다운로드
ollama pull phi3:mini

# 3. Docker Compose로 모든 서비스 실행
docker-compose up -d

# 4. 로그 확인
docker-compose logs -f

# 5. 애플리케이션 접속
# Frontend: http://localhost:3000
# Backend Board: http://localhost:3001
# Backend Chatbot: http://localhost:8000
```

### 2. 로컬 개발 환경 실행

#### MongoDB 실행
```bash
# MongoDB 설치 및 실행
mongod --dbpath /path/to/data
```

#### Backend Board (NestJS) 실행
```bash
cd backend-board

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일 편집

# 개발 서버 실행
npm run start:dev

# http://localhost:3001
```

#### Backend Chatbot (FastAPI) 실행
```bash
cd backend-chatbot

# Python 가상환경 생성
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# Ollama 실행 (별도 터미널)
ollama serve
ollama pull phi3:mini

# FastAPI 서버 실행
uvicorn main:app --reload --port 8000

# http://localhost:8000
```

#### Frontend (React) 실행
```bash
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm start

# http://localhost:3000
```

---

## 📚 API 명세

### Backend Board API (NestJS)

#### 인증 API

**회원가입**
```http
POST /posts/auth/signup
Content-Type: application/json

{
  "username": "john",
  "email": "john@example.com",
  "password": "password123"
}

Response 201:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "john",
    "email": "john@example.com",
    "userId": "507f1f77bcf86cd799439011"
  }
}
```

**로그인**
```http
POST /posts/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response 200: (동일한 형식)
```

#### 게시글 API

**게시글 목록 조회**
```http
GET /posts?page=1&limit=10&search=React&sort=latest

Response 200:
{
  "posts": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "React 시작하기",
      "content": "React 기초 내용...",
      "author": "john",
      "authorId": "123",
      "views": 42,
      "commentsCount": 5,
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-01-15T10:30:00Z"
    }
  ],
  "currentPage": 1,
  "totalPages": 5
}
```

**게시글 상세 조회**
```http
GET /posts/:id

Response 200:
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "게시글 제목",
  "content": "게시글 내용...",
  "author": "john",
  "authorId": "123",
  "views": 43,  // 조회 시 자동 증가
  "comments": [
    {
      "content": "좋은 글이네요!",
      "author": "jane",
      "authorId": "456",
      "createdAt": "2025-01-15T11:00:00Z"
    }
  ],
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-01-15T10:30:00Z"
}
```

**게시글 작성**
```http
POST /posts
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "title": "새 게시글",
  "content": "게시글 내용...",
  "author": "john",
  "authorId": "123"
}

Response 201: (생성된 게시글 객체)
```

**게시글 수정**
```http
PATCH /posts/:id
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "title": "수정된 제목",
  "content": "수정된 내용"
}

Response 200: (업데이트된 게시글 객체)
```

**게시글 삭제**
```http
DELETE /posts/:id
Authorization: Bearer <JWT_TOKEN>

Response 200: { "message": "Post deleted successfully" }
```

**댓글 추가**
```http
POST /posts/:id/comments
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "content": "댓글 내용",
  "author": "jane",
  "authorId": "456"
}

Response 201: (댓글이 추가된 게시글 객체)
```

### Backend Chatbot API (FastAPI)

**AI 챗봇 검색**
```http
POST /api/chat
Content-Type: application/json

{
  "message": "show me recent React posts",
  "conversation_history": [
    {
      "role": "user",
      "content": "hello"
    },
    {
      "role": "assistant",
      "content": "Hello! What are you looking for?"
    }
  ]
}

Response 200:
{
  "message": "Found 3 posts about 'React'.",
  "posts": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "React 시작하기",
      "content": "...",
      "author": "john",
      "views": 42,
      "comments": [...],
      "createdAt": "2025-01-15T10:30:00Z"
    }
  ]
}
```

---

## 📁 프로젝트 구조

```
genai/
├── frontend/                    # React 프론트엔드
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/           # 인증 관련 컴포넌트
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Signup.jsx
│   │   │   ├── Board/          # 게시판 컴포넌트
│   │   │   │   ├── Board.jsx
│   │   │   │   ├── PostForm.jsx
│   │   │   │   ├── PostDetail.jsx
│   │   │   │   └── Pagination.jsx
│   │   │   ├── ChatBot/        # AI 챗봇 컴포넌트
│   │   │   │   ├── ChatBot.jsx
│   │   │   │   └── ChatBot.css
│   │   │   └── Header.jsx      # 네비게이션 헤더
│   │   ├── App.jsx             # 메인 앱 컴포넌트
│   │   └── index.js            # 진입점
│   ├── Dockerfile              # Frontend Docker 설정
│   ├── nginx.conf              # Nginx 리버스 프록시 설정
│   └── package.json
│
├── backend-board/               # NestJS 백엔드
│   ├── src/
│   │   ├── auth/               # 인증 모듈
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── jwt.strategy.ts
│   │   │   └── schemas/
│   │   │       └── user.schema.ts
│   │   ├── posts/              # 게시글 모듈
│   │   │   ├── posts.controller.ts
│   │   │   ├── posts.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-post.dto.ts
│   │   │   │   └── create-comment.dto.ts
│   │   │   └── schemas/
│   │   │       └── post.schema.ts
│   │   ├── app.module.ts       # 루트 모듈
│   │   └── main.ts             # 진입점
│   ├── Dockerfile
│   └── package.json
│
├── backend-chatbot/             # FastAPI 백엔드
│   ├── services/
│   │   ├── llm_service.py      # Ollama LLM 연동
│   │   ├── search_service.py   # 게시글 검색
│   │   └── message_service.py  # 메시지 처리 오케스트레이션
│   ├── models/
│   │   └── schemas.py          # Pydantic 모델
│   ├── main.py                 # FastAPI 앱 진입점
│   ├── Dockerfile
│   └── requirements.txt
│
├── docker-compose.yml           # Docker Compose 설정
└── README.md                    # 이 파일
```

---

## 💡 주요 구현 사항

### 1. AI 자연어 검색 시스템

**구현 방식**:
1. 사용자가 자연어 질문 입력 (예: "최신 React 게시글 보여줘")
2. FastAPI 서버가 Ollama LLM에 프롬프트 전송
3. LLM이 JSON 형식으로 의도 추출:
   ```json
   {
     "type": "search",
     "keyword": "React",
     "sort": "latest",
     "limit": 3
   }
   ```
4. NestJS 백엔드에서 MongoDB 검색 수행
5. 검색 결과를 자연어 메시지로 포맷팅
6. 프론트엔드에서 카드 형태로 표시

**핵심 코드**:
- [`backend-chatbot/services/llm_service.py`](backend-chatbot/services/llm_service.py) - LLM 프롬프트 엔지니어링
- [`backend-chatbot/services/search_service.py`](backend-chatbot/services/search_service.py) - NestJS API 호출
- [`frontend/src/components/ChatBot/ChatBot.jsx`](frontend/src/components/ChatBot/ChatBot.jsx) - 챗봇 UI

### 2. JWT 인증 시스템

**인증 플로우**:
1. 사용자가 로그인/회원가입
2. 서버가 JWT 토큰 발급 (유효기간: 7일)
3. 클라이언트가 localStorage에 토큰 저장
4. 이후 요청 시 `Authorization: Bearer <token>` 헤더에 포함
5. 서버가 토큰 검증 후 요청 처리

**보호된 엔드포인트**:
- 게시글 작성, 수정, 삭제
- 댓글 작성

**핵심 코드**:
- [`backend-board/src/auth/jwt.strategy.ts`](backend-board/src/auth/jwt.strategy.ts) - JWT 검증
- [`backend-board/src/auth/auth.service.ts`](backend-board/src/auth/auth.service.ts) - 토큰 발급

### 3. MongoDB 검색 최적화

**검색 쿼리**:
```typescript
const filter = search ? {
  $or: [
    { title: { $regex: search, $options: 'i' } },      // 제목 검색
    { content: { $regex: search, $options: 'i' } },    // 내용 검색
    { author: { $regex: search, $options: 'i' } }      // 작성자 검색
  ]
} : {};
```

**정렬 옵션**:
- `latest`: `{ createdAt: -1 }` (최신순)
- `views`: `{ views: -1 }` (조회수 많은 순)
- `comments`: `{ commentsCount: -1 }` (댓글 많은 순)

**핵심 코드**:
- [`backend-board/src/posts/posts.service.ts`](backend-board/src/posts/posts.service.ts) - MongoDB 쿼리

### 4. Docker 멀티 스테이지 빌드

**Frontend Dockerfile**:
```dockerfile
# Build stage - Node.js로 React 앱 빌드
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage - Nginx로 정적 파일 서빙
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

**이점**:
- 최종 이미지 크기 최소화 (빌드 도구 제외)
- 프로덕션 최적화된 정적 파일
- Nginx 리버스 프록시로 API 라우팅

### 5. 권한 검증 시스템

**게시글 수정/삭제 시 검증**:
```typescript
async update(id: string, updateDto: UpdatePostDto, userId: string) {
  const post = await this.postModel.findById(id);

  if (post.authorId !== userId) {
    throw new ForbiddenException('You can only edit your own posts');
  }

  return this.postModel.findByIdAndUpdate(id, updateDto, { new: true });
}
```

**프론트엔드에서도 UI 제어**:
```javascript
const isAuthor = post.authorId === currentUser.userId;

{isAuthor && (
  <button onClick={handleEdit}>Edit</button>
  <button onClick={handleDelete}>Delete</button>
)}
```

---

## ⚙️ 개발 환경 설정

### 환경 변수

#### Backend Board (.env)
```env
# MongoDB
MONGO_URI=mongodb://localhost:27017/board

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Server
PORT=3001
```

#### Backend Chatbot (.env)
```env
# Ollama
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=phi3:mini

# Board API
BOARD_API_URL=http://localhost:3001

# Server
PORT=8000
```

#### Frontend (.env)
```env
# API URLs
REACT_APP_BOARD_API_URL=http://localhost:3001
REACT_APP_CHATBOT_API_URL=http://localhost:8000
```

### 포트 설정

| 서비스 | 포트 | 설명 |
|--------|------|------|
| Frontend | 3000 | React 개발 서버 / Nginx |
| Backend Board | 3001 | NestJS API 서버 |
| Backend Chatbot | 8000 | FastAPI 서버 |
| MongoDB | 27017 | 데이터베이스 |
| Ollama | 11434 | LLM 서비스 |

---

## 🐛 알려진 이슈

### 1. Ollama 연결 문제
**증상**: FastAPI 서버가 Ollama에 연결하지 못함
**원인**: Docker 네트워크 설정 또는 Ollama 미실행
**해결**:
```bash
# 호스트에서 Ollama 실행 확인
ollama list

# Docker Compose 재시작
docker-compose down
docker-compose up -d
```

### 2. CORS 에러
**증상**: Frontend에서 API 호출 시 CORS 에러
**원인**: Nginx 리버스 프록시 설정 누락
**해결**: `frontend/nginx.conf` 파일 확인 및 재빌드

### 3. JWT 토큰 만료
**증상**: 로그인 후 시간이 지나면 401 에러
**원인**: JWT 토큰 만료 (기본 7일)
**해결**: 다시 로그인하거나 토큰 갱신 로직 추가

### 4. MongoDB 연결 실패
**증상**: NestJS 서버 시작 시 MongoDB 연결 실패
**원인**: MongoDB 서비스 미실행
**해결**:
```bash
# Docker 환경
docker-compose up -d mongodb

# 로컬 환경
mongod --dbpath /path/to/data
```

---

## 🚧 향후 개선 계획

### 단기 계획 (1-2주)
- [ ] 단위 테스트 작성 (Jest, pytest)
- [ ] E2E 테스트 추가 (Cypress)
- [ ] 에러 바운더리 구현
- [ ] 로딩 스피너 개선
- [ ] 반응형 디자인 개선

### 중기 계획 (1-2개월)
- [ ] 이미지 업로드 기능
- [ ] 게시글 좋아요 기능
- [ ] 사용자 프로필 페이지
- [ ] 알림 시스템
- [ ] 검색어 자동완성
- [ ] 다크 모드 지원

### 장기 계획 (3개월+)
- [ ] WebSocket 기반 실시간 댓글
- [ ] Redis 캐싱 도입
- [ ] Elasticsearch 검색 엔진 통합
- [ ] 마이크로서비스 분리 (Kubernetes)
- [ ] CI/CD 파이프라인 구축
- [ ] 성능 모니터링 (Prometheus, Grafana)
- [ ] 다국어 지원 (i18n)

---

## 📝 개발 가이드라인

### 커밋 메시지 규칙
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅 (로직 변경 없음)
refactor: 코드 리팩토링
test: 테스트 추가/수정
chore: 빌드 설정 변경
```

### 브랜치 전략
- `main`: 프로덕션 코드
- `develop`: 개발 브랜치
- `feature/*`: 새 기능 개발
- `bugfix/*`: 버그 수정
- `hotfix/*`: 긴급 수정

### 코드 리뷰 체크리스트
- [ ] 코드에 주석이 충분히 작성되어 있는가?
- [ ] 에러 핸들링이 적절히 되어 있는가?
- [ ] 보안 취약점이 없는가?
- [ ] 성능 이슈가 없는가?
- [ ] 테스트 코드가 작성되어 있는가?

---

## 🤝 기여 방법

1. 이 저장소를 Fork합니다.
2. 새 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'feat: Add amazing feature'`)
4. 브랜치에 Push합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다.

---

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

---

## 👥 개발자

- **Backend Board**: NestJS, MongoDB, JWT 인증
- **Backend Chatbot**: FastAPI, Ollama, LLM 통합
- **Frontend**: React, 반응형 UI, ChatBot 인터페이스
- **DevOps**: Docker, Docker Compose, Nginx

---

## 📞 문의

프로젝트에 대한 질문이나 제안사항이 있으시면 이슈를 생성해 주세요.

---

**Built with ❤️ using React, NestJS, FastAPI, and Ollama**
