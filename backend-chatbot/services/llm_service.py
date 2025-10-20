

import os
import json
import openai
from typing import List
from models.schemas import ChatMessage

# OpenAI API 키 설정
openai.api_key = os.getenv("OPENAI_API_KEY")

SYSTEM_PROMPT_EXTRACT_INTENT = """
당신은 게시판 검색 어시스턴트입니다.
사용자의 질문을 분석하여 다음 중 하나를 수행하세요:
1. 게시글 검색이 필요한 경우: JSON 형식으로 검색 쿼리를 생성합니다.
   - type: "search"
   - keyword: 검색할 키워드
   - category: 카테고리 (선택사항)
   - sort: "latest" | "popular" | "views" 중 하나
   - limit: 결과 개수 (기본 5)
2. 일반 대화인 경우:
   - type: "general"
   - message: 사용자에게 전달할 일반 응답 메시지
JSON 형식으로만 응답해야 합니다.
예시 1: {"type": "search", "keyword": "React", "sort": "latest", "limit": 5}
예시 2: {"type": "general", "message": "안녕하세요! 무엇을 도와드릴까요?"}
"""

async def extract_search_intent(user_message: str, history: List[ChatMessage]):
    """LLM을 사용하여 사용자 메시지에서 검색 의도를 추출합니다."""
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT_EXTRACT_INTENT},
        *[{"role": msg.role, "content": msg.content} for msg in history[-5:]],
        {"role": "user", "content": user_message}
    ]
    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            temperature=0.2,
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"LLM 의도추출 Error: {e}")
        return {"type": "general", "message": "죄송합니다. 요청을 처리하는 중 오류가 발생했습니다."}

async def format_search_results(posts: List[dict], user_query: str):
    """검색 결과를 사용자 친화적인 자연어로 설명합니다."""
    if not posts:
        return "아쉽지만 검색 결과가 없습니다. 다른 키워드로 다시 시도해 보세요."

    posts_summary = "\n".join([
        f"- 제목: {post.get('title', 'N/A')} (조회수: {post.get('views', 0)})"
        for post in posts[:5]
    ])

    prompt = f"""
    사용자가 "{user_query}"(이)라고 질문하여 아래와 같은 게시글 {len(posts)}개를 찾았습니다.

    {posts_summary}

    위 검색 결과를 바탕으로, 찾은 게시글들을 친절하고 자연스럽게 요약해서 안내해주세요.
    - 몇 개의 게시글을 찾았는지 알려주세요.
    - 게시글들의 핵심 내용을 간단히 언급해주세요.
    - 2~3 문장으로 간결하게 한국어로 작성해주세요.
    """
    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=250
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"LLM 요약 Error: {e}")
        return f"총 {len(posts)}개의 게시글을 찾았습니다. 직접 확인해보세요."