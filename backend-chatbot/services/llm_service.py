import os
import json
import ollama
from typing import List
from models.schemas import ChatMessage

# Ollama 클라이언트 설정 (빠른 phi3:mini 모델 사용)
OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "phi3:mini")

# --- [수정] 일반 대화를 더 잘 구분하도록 시스템 프롬프트를 대폭 수정 ---
SYSTEM_PROMPT_EXTRACT_INTENT = """
You are a sophisticated intent classifier. Your primary goal is to distinguish between a search query and a general conversation.

1.  **If the user's message is a search query for the bulletin board**, create a JSON object for the search.
    - Examples of search queries: "최근 리액트 글 3개", "인기있는 글", "파이썬 관련", "Show me the latest posts"
    - Create JSON like: {"type": "search", "keyword": "...", "sort": "...", "limit": ...}

2.  **If the user is just talking to you, making a statement, or asking a non-search question**, you MUST classify it as "general".
    - Examples of general conversation: "안녕", "고마워", "너 바보야?", "오늘 날씨 어때?", "장난하냐", "Are you kidding me?"
    - Create JSON like: {"type": "general", "message": "I'm an AI assistant. How can I help you with the board?"}

You MUST ONLY respond in JSON format. Do not add any other explanations.

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
        return result

    except Exception as e:
        print(f"Ollama({OLLAMA_MODEL}) 의도추출 Error: {e}")
        return {"type": "general", "message": "죄송합니다. 요청을 분석하는 중 오류가 발생했습니다."}

async def format_search_results(posts: List[dict], user_query: str):
    if not posts:
        return "아쉽지만 검색 결과가 없습니다. 다른 키워드로 다시 시도해 보세요."

    keyword = user_query.replace("보여줘", "").replace("알려줘", "").strip()
    
    prompt = f"""
    Analyze the user's keyword: "{keyword}"
    Your task is to generate a single sentence in KOREAN based on the following rules.
    Output ONLY the resulting sentence, nothing else.

    - Rule 1: If the keyword is '최근' or '최신', the output is exactly: "최근 작성된 글 목록입니다."
    - Rule 2: If the keyword is '인기', the output is exactly: "가장 인기 있는 글 목록입니다."
    - Rule 3: For any other keyword, the output is: "'{keyword}' 관련 글 목록입니다."

    Now, generate the single KOREAN sentence for the keyword "{keyword}".
    """
    try:
        response = ollama.chat(
            model=OLLAMA_MODEL,
            messages=[{"role": "user", "content": prompt}],
            options={'temperature': 0.1}
        )
        return response['message']['content'].strip().replace('"', '')
    except Exception as e:
        print(f"Ollama({OLLAMA_MODEL}) 요약 Error: {e}")
        return f"'{keyword}'에 대한 검색 결과입니다."

