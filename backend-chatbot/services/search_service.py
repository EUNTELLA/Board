# 게시판 API 호출

import os
import httpx
from typing import List,Dict

BOARD_API_URL = os.getenv("BOARD_API_URL","http://localhost:3001")

async def search_posts_from_nest(query_params: dict) -> List[Dict]:
    """Nest.js 게시판 API에서 게시글을 검색"""
    params = {
        "search": query_params.get("keyword", ""),
        "limit": query_params.get("limit", 3),  # 기본값 3개로 변경
        "page": 1,  # 항상 첫 페이지
        "sort": query_params.get("sort", "latest")  # 정렬 기준 추가
    }

    # 빈 파라미터 제거 (단, sort는 기본값이 있으므로 유지)
    filtered_params = {}
    for k, v in params.items():
        if k == "sort" or v:  # sort는 항상 포함, 나머지는 값이 있을 때만
            filtered_params[k] = v
    params = filtered_params

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{BOARD_API_URL}/posts",
                params=params,
                timeout=10.0
            )
            response.raise_for_status()
            data = response.json()

            # NestJS에서 {posts: [...], currentPage, totalPages} 형태로 반환
            # posts 배열만 추출해서 반환
            return data.get('posts', []) if isinstance(data, dict) else data

        except httpx.RequestError as e:
            print(f"게시판 API 요청 Error: {e}")
            return []
        except Exception as e:
            print(f"게시판 API 처리 Error: {e}")
            return []