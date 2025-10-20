from pydantic import BaseModel
from typing import List, Optional


class ChatMessage(BaseModel):
    role: str
    content: str
    
class ChatRequest(BaseModel):
    message: str
    conversation_history: List[ChatMessage] = []
    
class ChatResponse(BaseModel):
    message : str
    posts: Optional[List[dict]] = None
    query_info: Optional[dict] = None