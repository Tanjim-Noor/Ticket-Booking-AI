"""Core configuration settings using Pydantic Settings."""
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Application
    APP_NAME: str = "Bus Ticket Booking AI Chatbot"
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str
    
    # Google Gemini API
    GOOGLE_API_KEY: str
    
    # ChromaDB
    CHROMA_PERSIST_DIR: str = str(Path(__file__).parent.parent.parent / "chroma_data")
    
    # LangSmith (Optional - for monitoring and tracing)
    LANGSMITH_TRACING: str = "false"
    LANGSMITH_ENDPOINT: str = "https://api.smith.langchain.com"
    LANGSMITH_API_KEY: str = ""
    LANGSMITH_PROJECT: str = "bus-ticket-booking-ai"
    
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)


# Global settings instance
settings = Settings()
