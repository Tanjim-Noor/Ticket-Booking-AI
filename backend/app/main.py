"""FastAPI application initialization and configuration."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables for LangChain
load_dotenv()

from app.core.config import settings
from app.core.logging import logger
from app.api.endpoints import chat, buses, bookings

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.DEBUG
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Run on application startup."""
    logger.info(f"Starting {settings.APP_NAME}")
    logger.info(f"DEBUG: CHROMA_PERSIST_DIR is set to: {settings.CHROMA_PERSIST_DIR}")


@app.on_event("shutdown")
async def shutdown_event():
    """Run on application shutdown."""
    logger.info(f"Shutting down {settings.APP_NAME}")

# Register API routers
app.include_router(chat.router, prefix="/api/v1", tags=["chat"])
app.include_router(buses.router, prefix="/api/v1", tags=["buses"])
app.include_router(bookings.router, prefix="/api/v1", tags=["bookings"])

@app.get("/")
async def root():
    return {"message": "Welcome to Bus Ticket Booking AI Chatbot API"}

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
