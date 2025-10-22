# Docker로 실행하기

## 사전 요구사항

1. **Docker Desktop 설치** (Windows/Mac)
   - https://www.docker.com/products/docker-desktop

2. **Ollama 설치 및 실행** (호스트에서)
   ```bash
   # Ollama 설치
   # https://ollama.ai/download

   # Ollama 실행
   ollama serve

   # phi3:mini 모델 다운로드
   ollama pull phi3:mini
   ```

## 실행 방법

### 1. 전체 서비스 시작

```bash
# 프로젝트 루트 디렉토리에서
docker-compose up -d
```

### 2. 로그 확인

```bash
# 전체 로그
docker-compose logs -f

# 특정 서비스 로그만
docker-compose logs -f backend-chatbot
```

### 3. 서비스 중지

```bash
docker-compose down
```

### 4. 완전히 삭제 (볼륨 포함)

```bash
docker-compose down -v
```

## 접속 정보

- **Frontend**: http://localhost:3000
- **Backend Board API**: http://localhost:3001
- **Chatbot API**: http://localhost:8000
- **MongoDB**: localhost:27017

## Docker 장점

✅ **환경 일관성**: 모든 개발자가 동일한 환경에서 작업
✅ **의존성 격리**: Node.js, Python 버전 충돌 없음
✅ **빠른 시작**: `docker-compose up` 한 번에 전체 실행
✅ **운영 환경과 동일**: 프로덕션 배포와 동일한 환경
✅ **쉬운 정리**: `docker-compose down`으로 깔끔하게 삭제

## 개발 모드 (hot reload)

개발 중에는 로컬에서 직접 실행하는 것을 추천합니다:

```bash
# Backend Board
cd backend-board
npm run start:dev

# Backend Chatbot
cd backend-chatbot
python main.py

# Frontend
cd frontend
npm start
```

## 트러블슈팅

### Ollama 연결 안 됨
- Windows/Mac: `host.docker.internal:11434` 사용
- Linux: `--network host` 또는 호스트 IP 사용

### 포트 충돌
- 다른 서비스가 3000, 3001, 8000 포트 사용 중인지 확인
- docker-compose.yml에서 포트 변경 가능

### MongoDB 연결 실패
- `docker-compose logs mongodb` 확인
- 볼륨 삭제 후 재시작: `docker-compose down -v && docker-compose up -d`
