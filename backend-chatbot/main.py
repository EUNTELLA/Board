from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from contextlib import asynccontextmanager
import logging
import os
import sys

from models.schemas import ChatRequest, ChatResponse
from services.llm_service import extract_search_intent, format_search_results
from services.search_service import search_posts_from_nest

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('chatbot.log')
    ]
)
logger = logging.getLogger(__name__)

# .env 파일 로드
load_dotenv()

# 환경 변수 검증
def validate_environment():
    # 필수 환경 변수 목록 (실제 사용하는 변수들)
    required_vars = {
        "OLLAMA_HOST": "http://localhost:11434",
        "OLLAMA_MODEL": "phi3:mini",
        "BOARD_API_URL": "http://localhost:3001"
    }

    # 환경 변수 확인 및 기본값 설정
    for var, default_value in required_vars.items():
        value = os.getenv(var)
        if not value:
            logger.warning(f"{var} not set, using default: {default_value}")
        else:
            logger.info(f"{var} = {value}")

    logger.info("Environment variables validated successfully")

# 환경 변수 검증 실행
validate_environment()

# Lifespan 이벤트 핸들러
@asynccontextmanager
async def lifespan(_app: FastAPI):
    # 시작 시
    logger.info("Starting chatbot API server...")
    logger.info(f"CORS allowed origins: {['http://localhost:3000']}")
    yield
    # 종료 시
    logger.info("Shutting down chatbot API server...")

app = FastAPI(title="게시판 챗봇 API", lifespan=lifespan)

# CORS 미들웨어 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger.info("FastAPI application initialized")

# 챗봇 메세지 처리 엔드 포인트 

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    logger.info(f"Received chat request: {request.message[:50]}...")

    try:
        # LLM 의도 추출
        try:
            intent = await extract_search_intent(request.message, request.conversation_history)
            logger.info(f"Extracted intent type: {intent.get('type')}")
        except Exception as e:
            logger.error(f"Failed to extract search intent: {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=500,
                detail="의도를 분석하는 중 오류가 발생했습니다."
            )

        # 검색 타입인 경우
        if intent.get("type") == "search":
            try:
                api_response = await search_posts_from_nest(intent)
                posts = api_response.get('posts', []) if isinstance(api_response, dict) else api_response
                logger.info(f"Retrieved {len(posts) if posts else 0} posts from search")
            except Exception as e:
                logger.error(f"Failed to search posts: {str(e)}", exc_info=True)
                raise HTTPException(
                    status_code=500,
                    detail="게시글 검색 중 오류가 발생했습니다."
                )

            try:
                message = await format_search_results(posts, request.message)
                return ChatResponse(message=message, posts=posts, query_info=intent)
            except Exception as e:
                logger.error(f"Failed to format search results: {str(e)}", exc_info=True)
                raise HTTPException(
                    status_code=500,
                    detail="검색 결과를 포맷팅하는 중 오류가 발생했습니다."
                )

        # 일반 대화 타입인 경우
        else:
            message = intent.get("message", "무엇을 도와드릴까요?")
            logger.info(f"Returning general response")
            return ChatResponse(message=message, posts=None, query_info=intent)

    except HTTPException:
        # HTTPException은 그대로 전달
        raise
    except Exception as e:
        # 예상치 못한 에러
        logger.error(f"Unexpected error in chat endpoint: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="서버 내부 오류가 발생했습니다."
        )

@app.get("/health")
async def health_check():
    """서버 상태 확인 엔드포인트"""
    logger.debug("Health check requested")
    return {
        "status": "healthy",
        "service": "chatbot-api",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting uvicorn server...")
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

