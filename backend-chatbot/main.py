# backend-chatbot/main.py

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# 분리한 모듈들을 import
from models.schemas import ChatRequest, ChatResponse
from services.llm_service import extract_search_intent, format_search_results
from services.search_service import search_posts_from_nest

# .env 파일 로드
load_dotenv()

app = FastAPI(title="게시판 챗봇 API")

# CORS 미들웨어 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """챗봇 메인 엔드포인트"""
    try:
        # 1. 사용자 메시지로부터 의도 파악
        intent = await extract_search_intent(request.message, request.conversation_history)

        # 2-1. 의도가 '게시글 검색'일 경우
        if intent.get("type") == "search":
            posts = await search_posts_from_nest(intent)
            message = await format_search_results(posts, request.message)
            return ChatResponse(message=message, posts=posts, query_info=intent)

        # 2-2. 의도가 '일반 대화'일 경우
        else:
            message = intent.get("message", "무엇을 도와드릴까요?")
            return ChatResponse(message=message, posts=None, query_info=intent)

    except Exception as e:
        print(f"Chat API Error: {e}")
        raise HTTPException(status_code=500, detail="서버 내부 오류가 발생했습니다.")

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# 서버 실행 (개발용)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)