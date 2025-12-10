# 🤖 Eun Board - AI 기반 게시판 프로젝트

**Ollama와 RAG(Retrieval-Augmented Generation) 기술을 활용한 AI 자연어 검색 게시판**

개인 포트폴리오를 위해 개발한 풀스택 웹 애플리케이션입니다. 사용자는 자연어로 게시글을 검색하고, AI 챗봇과 대화하며 원하는 정보를 얻을 수 있습니다.

![스크린샷](https://via.placeholder.com/800x450.png?text=Project+Screenshot+Here)
*(여기에 프로젝트 스크린샷을 추가하세요)*

---

## ✨ 주요 기능

*   **🤖 AI 자연어 검색**: "최신 React 관련 글 찾아줘"와 같이 자연어로 게시글을 검색합니다.
*   **💬 대화형 챗봇 UI**: AI 챗봇과 대화하며 검색 결과를 얻고, 이전 대화 기록을 관리합니다.
*   **🔐 JWT 기반 인증**: 안전한 회원가입 및 로그인 기능을 제공합니다.
*   **📝 CRUD 게시판**: 게시글 작성, 조회, 수정, 삭제 등 기본적인 게시판 기능을 모두 지원합니다.
*   **📄 페이지네이션 및 정렬**: 게시글 목록을 페이지 단위로 보고, 최신순, 조회순 등으로 정렬합니다.
*   **📱 반응형 디자인**: 데스크톱과 모바일 환경에 최적화된 UI를 제공합니다.

---

## 🛠️ 기술 스택

| 구분 | 기술 |
| :--- | :--- |
| **Frontend** | React, React Router, Tailwind CSS |
| **Backend (Board)** | NestJS, MongoDB, Mongoose, JWT |
| **Backend (Chatbot)** | FastAPI, Python |
| **AI/LLM** | **Ollama**, **phi3:mini (3.8B)**, RAG |
| **DevOps** | Docker, Docker Compose, Nginx |

---

## 🏗️ 시스템 아키텍처

이 프로젝트는 마이크로서비스 아키텍처(MSA)를 기반으로 설계되었습니다. 각 서비스는 독립적으로 작동하며, Docker를 통해 쉽게 관리됩니다.

```mermaid
graph TD
    User[User] --> Nginx[Nginx (Reverse Proxy)]
    Nginx --> Frontend[Frontend (React)]
    Nginx -->|/api/posts| Board[Backend Board (NestJS)]
    Nginx -->|/api/chat| Chatbot[Backend Chatbot (FastAPI)]
    Board --> MongoDB[(MongoDB)]
    Chatbot --> Ollama[Ollama LLM]
```

**데이터 흐름 (AI 검색)**:
1.  **Frontend → Chatbot (FastAPI)**: 사용자의 자연어 질문을 전달합니다.
2.  **Chatbot (FastAPI) → Ollama LLM**: 질문에서 검색 키워드를 추출합니다.
3.  **Chatbot (FastAPI) → Board (NestJS)**: 추출된 키워드로 게시글 검색을 요청합니다.
4.  **Board (NestJS) → MongoDB**: 데이터베이스에서 게시글을 검색합니다.
5.  **Chatbot (FastAPI)**: 검색된 결과를 바탕으로 최종 답변을 생성하여 Frontend에 전달합니다.

---

## 🚀 시작하기

Docker를 사용하면 모든 서비스를 한 번에 실행할 수 있습니다.

### 사전 요구사항
*   [Docker Desktop](https://www.docker.com/products/docker-desktop/)
*   [Ollama](https://ollama.ai/) 설치 및 `phi3:mini` 모델 다운로드
    ```bash
    ollama pull phi3:mini
    ```

### 실행 방법
```bash
# 1. 프로젝트 클론
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

# 2. 환경 변수 설정 (.env)
# 프로젝트 루트에 .env 파일을 생성하고 필요한 환경 변수를 설정하세요.
# (예: .env.example 파일이 있다면 참고하여 작성)

# 3. Docker Compose 실행
# (Ollama가 호스트 머신에서 실행 중이어야 합니다)
docker-compose up -d --build

# 4. 애플리케이션 접속
# - 프론트엔드: http://localhost:3000
# - 게시판 API: http://localhost:3001
# - 챗봇 API: http://localhost:8000
```

---

## 💡 프로젝트 회고 및 배운 점

이 프로젝트를 통해 다음과 같은 경험을 할 수 있었습니다.

*   **LLM 모델 선정의 중요성**: `phi3:mini` 같이 로컬 환경에서도 빠른 응답 속도를 보여주는 경량 모델을 선택하여 프로젝트의 실용성을 높였습니다.
*   **RAG 파이프라인 구축**: 단순한 LLM 호출을 넘어, 외부 데이터베이스(MongoDB)와 연동하여 정보를 검색하고 이를 바탕으로 답변을 생성하는 RAG 파이프라인을 직접 설계하고 구현했습니다.
*   **MSA 설계 및 운영**: 각기 다른 기술 스택(NestJS, FastAPI)으로 구성된 백엔드 서비스들을 Docker Compose와 Nginx 리버스 프록시를 통해 효율적으로 통합하고 관리하는 방법을 익혔습니다.

---

## 👨‍💻 개발자

*   **이름**: 김은비
*   **이메일**: kimeunbee87@gmail.com
*   **GitHub**: https://github.com/EUNTELLA
