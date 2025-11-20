from fastapi import APIRouter, HTTPException, Depends
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.rag_service import get_rag_service, RAGService
from app.core.logging import logger
import uuid

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(
    request: ChatRequest,
    rag_service: RAGService = Depends(get_rag_service)
):
    """
    Chat endpoint for the Bus Ticket Booking AI.
    Accepts a user message and returns an AI response with sources.
    """
    try:
        # Generate a conversation ID if not provided
        conversation_id = request.conversation_id or str(uuid.uuid4())
        
        # Get the last user message
        user_message = request.message
        
        # Get answer from RAG service
        result = await rag_service.get_answer(user_message)
        
        # Construct response
        response = ChatResponse(
            response=result["answer"],
            conversation_id=conversation_id,
            sources=result["sources"]
        )
        
        return response
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error processing chat request")
