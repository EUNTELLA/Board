import os
import json
import ollama
from typing import List
from models.schemas import ChatMessage

# Ollama 클라이언트 설정 (빠른 phi3:mini 모델 사용)
OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "phi3:mini")

# --- [수정] 검색 의도를 더 잘 인식하도록 프롬프트 개선 ---
SYSTEM_PROMPT_EXTRACT_INTENT = """
You are an intent classifier for a bulletin board chatbot. Analyze the user's message and respond in JSON format.

**Search Query Patterns (type: "search"):**
- Latest posts: "최신글", "최근 글", "최근 게시글", "latest posts"
- Popular posts: "인기글", "조회수 많은 글", "인기있는 글", "popular posts"
- Posts with many comments: "댓글 많은 글", "댓글이 많은 글", "댓글 많은거", "most commented"
- Keyword search: "리액트 관련", "파이썬 글", "fastapi", "about react"
- Specific counts: "3개", "5개 보여줘", "show me 10 posts"

**General Conversation (type: "general"):**
- Greetings: "안녕", "hi", "hello"
- Thanks: "고마워", "감사", "thanks"
- Random talk: "너 바보야?", "날씨 어때?", "장난하냐"

**JSON Response Format:**

For SEARCH queries:
{{"type": "search", "keyword": "검색키워드 (없으면 빈문자열)", "sort": "latest|popular|comments", "limit": 3}}

For GENERAL conversation:
{{"type": "general", "message": "응답 메시지"}}

**Important Rules:**
1. If user asks about "댓글", "comment" → set sort: "comments", limit: 5
2. If user asks about "인기", "조회수", "popular" → set sort: "popular", limit: 5
3. If user asks about "최신", "최근", "latest" → set sort: "latest"
4. If user specifies a number (e.g., "3개", "10개") → use that as limit
5. Default limit is 3
6. Extract keyword - **CONVERT Korean tech terms to English:**
   - "리액트" → "React"
   - "파이썬" → "Python"
   - "자바스크립트" → "JavaScript"
   - "타입스크립트" → "TypeScript"
   - "넥스트" → "Next"
   - "네스트" → "Nest"
   - For other terms, keep as is

---
User's message: "{user_message}"
Your JSON response:
"""

async def extract_search_intent(user_message: str, history: List[ChatMessage]):
    # 프롬프트에 직접 user_message를 포함하도록 수정
    prompt = SYSTEM_PROMPT_EXTRACT_INTENT.format(user_message=user_message)

    messages = [
        {"role": "system", "content": prompt}
    ]
    try:
        response = ollama.chat(
            model=OLLAMA_MODEL,
            messages=messages,
            format='json',
            options={'temperature': 0.0}
        )
        # 챗봇이 생성한 응답이 general 메시지일 경우, 좀 더 적절한 답변으로 교체
        result = json.loads(response['message']['content'])
        if result.get("type") == "general":
             result["message"] = "게시판에 대해 무엇이 궁금하세요? '최신글', '인기글' 등으로 검색해보세요."

        # 한글 키워드를 영어로 변환 (LLM이 못할 경우를 대비)
        if result.get("type") == "search" and result.get("keyword"):
            keyword = result["keyword"]
            keyword_map = {
                "리액트": "React",
                "파이썬": "Python",
                "자바스크립트": "JavaScript",
                "타입스크립트": "TypeScript",
                "넥스트": "Next",
                "네스트": "Nest",
                "몽고": "Mongo",
                "패스트": "Fast"
            }
            for kr, en in keyword_map.items():
                if kr in keyword:
                    keyword = keyword.replace(kr, en)
            result["keyword"] = keyword

        return result

    except Exception as e:
        print(f"Ollama({OLLAMA_MODEL}) 의도추출 Error: {e}")
        return {"type": "general", "message": "죄송합니다. 요청을 분석하는 중 오류가 발생했습니다."}

async def format_search_results(posts: List[dict], user_query: str):
    if not posts:
        return "아쉽지만 검색 결과가 없습니다. 다른 키워드로 다시 시도해 보세요."

    # 간단한 룰 기반 응답 생성 (LLM 대신 빠르고 정확한 응답)
    query_lower = user_query.lower()

    if "댓글" in user_query or "comment" in query_lower:
        return f"댓글이 많은 글 {len(posts)}개를 찾았습니다."
    elif "인기" in user_query or "조회수" in user_query or "popular" in query_lower:
        return f"가장 인기 있는 글 {len(posts)}개를 찾았습니다."
    elif "최신" in user_query or "최근" in user_query or "latest" in query_lower:
        return f"최근 작성된 글 {len(posts)}개를 찾았습니다."
    else:
        # 키워드 추출 (보여줘, 알려줘 등 제거)
        keyword = user_query.replace("보여줘", "").replace("알려줘", "").replace("관련", "").replace("글", "").strip()
        if keyword:
            return f"'{keyword}' 관련 글 {len(posts)}개를 찾았습니다."
        else:
            return f"검색 결과 {len(posts)}개의 글을 찾았습니다."

