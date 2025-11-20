"""Core configuration settings using Pydantic Settings."""
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
    CHROMA_PERSIST_DIR: str = "./chroma_data"
    
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)


# Global settings instance
settings = Settings()
