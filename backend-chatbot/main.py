from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv


from models.schemas import ChatRequest, ChatResponse
from services.llm_service import extract_search_intent, format_search_results
from services.search_service import search_posts_from_nest

# .env 파일 로드
load_dotenv()

app = FastAPI(title="게시판 챗봇 API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        intent = await extract_search_intent(request.message, request.conversation_history)
        if intent.get("type") == "search":
            api_response = await search_posts_from_nest(intent)
            posts = api_response.get('posts', []) if isinstance(api_response, dict) else api_response
            message = await format_search_results(posts, request.message)
            return ChatResponse(message=message, posts=posts, query_info=intent)
        else:
            message = intent.get("message", "무엇을 도와드릴까요?")
            return ChatResponse(message=message, posts=None, query_info=intent)
    except Exception as e:
        print(f"Chat API Error: {e}")
        raise HTTPException(status_code=500, detail="서버 내부 오류가 발생했습니다.")

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    # uvicorn.run()의 첫 번째 인자를 "main:app" 문자열로 전달하는 것이 더 안정적입니다.
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

