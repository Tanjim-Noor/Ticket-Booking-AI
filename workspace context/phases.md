# AI RAG Chatbot Application - Phase Checklist

A step-by-step plan for building the AI RAG chatbot for bus ticket booking.

## Phase 1: Project Setup & Research
- Research best practices for FastAPI, LangChain, and Gemini API.
- Research modern front-end stack: Vite + React + TypeScript.
- Select UI library (Decision: Material UI).
- Create project structure (backend/ and frontend/ folders).
- Create initial README.md with setup instructions.

## Phase 2: Backend Foundation (Step 1) ✅
- Set up Python virtual environment.
- Research and install backend dependencies.
- Create FastAPI project structure with separation of concerns.
- Set up logging and Pydantic schemas.
- Verify FastAPI server runs.
- Git commit and push.

## Phase 3: Database Setup (Step 2) ✅
- Select PostgreSQL for core DB.
- Create backend/docker/docker-compose.yml for PostgreSQL, pgAdmin, ChromaDB.
- Configure Alembic migrations.
- Implement initial database models (districts, bus providers, bookings).
- Verify DB connection and migrations.
- Git commit and push.

## Phase 4: RAG Knowledge Base Setup (Step 3) ✅
- Research vector store & embedding options.
- Create ingestion pipeline for district and bus provider data and documents.
- Generate embeddings and store in ChromaDB (target: 80+ docs).
- Use HuggingFace or local embedding models for offline operation.
- Verify population of knowledge base.
- Git commit and push.

## Phase 5: LangChain RAG Pipeline (Step 4) ✅
- Implement LangChain pipeline with:
  - Gemini API LLM integration
  - Local embeddings
  - ChromaDB retriever
  - LangSmith monitoring (tracing)
- Create chat endpoint `/api/v1/chat`.
- Test RAG service and resolve import/quota issues.
- Git commit and push.

## Phase 6: Backend API Endpoints (Step 5)
- Build endpoints for:
  - Chat (query)
  - Search buses
  - Booking create/view/cancel
  - Bus provider details
- Add validation and error handling.
- Git commit and push.

## Phase 7: Frontend Foundation (Step 6)
- Initialize Vite + React + TypeScript project.
- Install MUI and supporting libraries.
- Create routing, basic pages, and global styles.
- Git commit and push.

## Phase 8: Frontend State Management & API Integration (Step 7)
- Implement TanStack Query and Zustand for state.
- Create API client and hooks.
- Git commit and push.

## Phase 9: Chatbot UI (Step 8)
- Implement chat interface with message display, input, and backend integration.
- Add loading states and error handling.
- Git commit and push.

## Phase 10: Search & Results UI (Step 9)
- Implement bus search UI, filtering, and results display.
- Add sorting & provider filters.
- Git commit and push.

## Phase 11: Final Integration & Testing (Step 10)
- End-to-end testing of RAG pipeline.
- Update README with final instructions.
- Git commit and push.

### Notes
- Verify each step before moving on.
- Use research resources to install latest packages (avoid hard-coded versions).
- Commit after each major milestone.
- Wait for user confirmation before proceeding to the next step.