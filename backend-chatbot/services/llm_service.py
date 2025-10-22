# ollama를 통한 llm 호출 및 키워드 추출

import os
import json
import ollama
from typing import List
from models.schemas import ChatMessage

# Ollama 클라이언트 설정 (빠른 phi3:mini 모델 사용)
OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "phi3:mini")


SYSTEM_PROMPT_EXTRACT_INTENT = """
You are a keyword extractor for bulletin board search. Extract ONLY the search keyword from user's message.

**Examples:**
Input: "123 관련 글 찾아줘" → Output: {{"type": "search", "keyword": "123", "sort": "latest", "limit": 3}}
Input: "React about" → Output: {{"type": "search", "keyword": "React", "sort": "latest", "limit": 3}}
Input: "은짱이 쓴 글" → Output: {{"type": "search", "keyword": "은짱", "sort": "latest", "limit": 3}}
Input: "latest posts" → Output: {{"type": "search", "keyword": "", "sort": "latest", "limit": 3}}
Input: "최신글" → Output: {{"type": "search", "keyword": "", "sort": "latest", "limit": 3}}
Input: "popular" → Output: {{"type": "search", "keyword": "", "sort": "popular", "limit": 5}}
Input: "인기글" → Output: {{"type": "search", "keyword": "", "sort": "popular", "limit": 5}}
Input: "hi" → Output: {{"type": "general", "message": "Hello! What are you looking for?"}}

**Keyword Extraction Rules:**
1. Extract the MAIN subject from the message
2. Remove filler words: "관련", "글", "찾아줘", "알려줘", "보여줘", "쓴", "about", "posts", "show", "find"
3. Korean tech terms → English: "리액트"→"React", "파이썬"→"Python"
4. Keep numbers as-is: "123"→"123"
5. Keep names as-is: "은짱"→"은짱"

**Sort Detection:**
- "latest", "최신", "최근", "recent" → sort: "latest"
- "popular", "인기", "조회수" → sort: "popular", limit: 5
- "comments", "댓글" → sort: "comments", limit: 5
- Default → sort: "latest"

User: "{user_message}"
JSON:
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
        result = json.loads(response['message']['content'])
        if result.get("type") == "general":
             result["message"] = "What would you like to know about the board? Try searching for 'recent posts', 'popular posts', etc."

        # 한글 키워드를 영어로 변환 (LLM이 못할 경우를 대비)
        if result.get("type") == "search" and result.get("keyword"):
            keyword = result["keyword"]

            # 불필요한 단어 제거
            remove_words = ["관련", "글", "쓴", "작성한", "에 대한", "대해", "찾아", "알려", "보여", "게시글", "포스트"]
            for word in remove_words:
                keyword = keyword.replace(word, "").strip()

            # 한글 기술용어를 영어로 변환
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

            result["keyword"] = keyword.strip()

        return result

    except Exception as e:
        print(f"Ollama({OLLAMA_MODEL}) intent extraction error: {e}")
        return {"type": "general", "message": "Sorry, an error occurred while analyzing your request."}

async def format_search_results(posts: List[dict], user_query: str):
    if not posts:
        return "No results found. Please try a different keyword."

    query_lower = user_query.lower()

    if "댓글" in user_query or "comment" in query_lower:
        return f"Found {len(posts)} posts with most comments."
    elif "인기" in user_query or "조회수" in user_query or "popular" in query_lower:
        return f"Found {len(posts)} most popular posts."
    elif "최신" in user_query or "최근" in user_query or "latest" in query_lower or "recent" in query_lower:
        return f"Found {len(posts)} recent posts."
    else:
        # Extract keyword
        keyword = user_query.replace("show", "").replace("find", "").replace("posts", "").replace("about", "").strip()
        if keyword and len(keyword) > 1:
            return f"Found {len(posts)} posts about '{keyword}'."
        else:
            return f"Found {len(posts)} posts."

