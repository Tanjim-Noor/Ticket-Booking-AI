"""Pydantic schemas for chat/query operations."""
from pydantic import BaseModel
from typing import Optional, List


class ChatRequest(BaseModel):
    """Request schema for chat endpoint."""
    message: str
    conversation_id: Optional[str] = None


class ChatResponse(BaseModel):
    """Response schema for chat endpoint."""
    response: str
    conversation_id: str
    sources: List[dict] = []
