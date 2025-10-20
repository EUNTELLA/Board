import os
import httpx
from typing import List,Dict

BOARD_API_URL = os.getenv("BOADRD_API_URL","http://localhost:3001")

async def search_posts_from_nest(query_paramas: dict) -> List[Dict]:
    """Nest.js 게시판 API에서 게시글을 검색"""
    params = {
        "search": query_paramas.get("keyword",""),
        "category": query_paramas.get("category",""),
        "sort": query_paramas.get("sort","latest"),
        "limit": query_paramas.get("limit",5)
    }
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{BOARD_API_URL}/posts",
                params=params,
                timeout = 10.0
            )
            response.raise_for_status() #200 OK가 아니면 예외 
            return response.json()
        except httpx.RequestError as e:
            print(f"게시판 API 요청 Error: {e}")            
            return []
        except Exception as e:
            print(f"게시판 API 처리 Error:{e}")
            return []