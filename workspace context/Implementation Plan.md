# AI RAG Chatbot for Bus Ticket Booking - Implementation Plan

## Goal
Build an AI-powered chatbot application that uses RAG (Retrieval-Augmented Generation) to help users search for buses, get provider info, and interact with booking data.

- Backend: FastAPI + LangChain (Gemini LLM).
- Frontend: Vite + React + TypeScript + Material UI.
- Database: PostgreSQL (Docker).
- Vector store: ChromaDB for RAG knowledge base.
- Knowledge Base content: districts, routes, fares, provider docs.

Example user questions:
- "Are there any buses from Dhaka to Rajshahi under 500 taka?"
- "Show all bus providers operating from Chittagong to Sylhet."
- "What are the contact details of Hanif Bus?"

## Security note
Do not hardcode API keys. Store sensitive values in environment variables like `.env`.
- Example: GEMINI_API_KEY=your_gemini_api_key_here

## Technology choices
- Database: PostgreSQL
- Vector store: ChromaDB
- UI: Material UI (MUI)
- State: TanStack Query + Zustand
- API client: Axios

## Repository structure (high-level)
- backend/
  - app/
    - main.py
    - core/
      - config.py
      - logging.py
      - database.py
    - models/
    - schemas/
    - api/
    - services/
    - utils/
  - docker/
    - docker-compose.yml
  - alembic/
  - requirements.txt
  - .env.example
- frontend/
  - src/
    - components/
    - services/
    - hooks/
    - stores/
    - types/
    - pages/
    - App.tsx
    - main.tsx
  - package.json
  - tsconfig.json
  - vite.config.ts
  - .env.example

## Backend quick-start
- Create and activate venv in backend.
- Install dependencies (use latest per docs).
- Start server:
  - uvicorn app.main:app --reload

## Docker
- Start services:
  - cd backend/docker
  - docker-compose up -d
- Verify services:
  - docker-compose ps

## RAG & Embeddings
- Use local or GeminI embeddings.
- Ingest documents (districts, routes, provider docs) into ChromaDB.
- Verify embeddings with sample queries.

## API & Frontend
- Backend endpoints:
  - /api/v1/chat — Chat with RAG
  - /api/v1/buses/search
  - /api/v1/bookings
- Frontend:
  - Chat UI (message history + input)
  - Search UI with filters
- Example frontend start:
  - cd frontend
  - npm run dev

## Verification plan
- After each step: manual verification + unit tests for backend where applicable.
- RAG checks: confirm returned sources are relevant and correct.
- Frontend checks: responsive UI, correct API integration.

## Next steps
- Confirm plan and technology choices.
- Provide environment variables via `.env`.
- Begin Phase 1 (project setup).
