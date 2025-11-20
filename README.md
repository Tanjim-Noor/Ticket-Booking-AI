# Bus Ticket Booking AI Chatbot

An AI-powered chatbot application using RAG (Retrieval-Augmented Generation) for bus ticket booking information and assistance.

## Tech Stack

### Backend
- **FastAPI** - Modern web framework for building APIs
- **LangChain** - RAG orchestration framework
- **Google Gemini API** - Large Language Model
- **SQLAlchemy** - SQL toolkit and ORM
- **Alembic** - Database migration tool
- **ChromaDB** - Vector database for embeddings
- **PostgreSQL** - Relational database

### Frontend
- **Vite** - Build tool
- **React** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Material UI** - Component library
- **TanStack Query** - Data fetching and caching
- **Zustand** - State management

## Project Structure

```
backend/
├── app/
│   ├── api/          # API endpoints
│   ├── core/         # Core configuration
│   ├── models/       # Database models
│   ├── schemas/      # Pydantic schemas
│   ├── services/     # Business logic
│   └── utils/        # Utility functions
├── docker/           # Docker configuration
├── .env              # Environment variables
└── requirements.txt  # Python dependencies

frontend/
├── src/
│   ├── components/   # React components
│   ├── services/     # API services
│   ├── hooks/        # Custom hooks
│   ├── stores/       # State management
│   ├── types/        # TypeScript types
│   └── pages/        # Page components
└── package.json      # Node dependencies
```

## Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- Docker & Docker Compose

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create and activate virtual environment:
   ```bash
   python -m venv venv
   
   # Windows
   .\venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   - Copy `.env.example` to `.env` (if exists)
   - Update `DATABASE_URL` and `GOOGLE_API_KEY`

5. Start database (PostgreSQL) using Docker:
   ```bash
   cd docker
   docker-compose up -d
   ```

6. Run database migrations:
   ```bash
   alembic upgrade head
   ```

7. Start the FastAPI server:
   ```bash
   uvicorn app.main:app --reload
   ```

   The backend API will be available at: `http://localhost:8000`
   API documentation: `http://localhost:8000/docs`

8. (Optional) Configure LangSmith for monitoring:
   - See [LANGSMITH_SETUP.md](backend/LANGSMITH_SETUP.md) for detailed instructions
   - Add `LANGSMITH_TRACING=true` and `LANGSMITH_API_KEY` to `.env`
   - View traces at [smith.langchain.com](https://smith.langchain.com)

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at: `http://localhost:5173`

## API Endpoints

- `GET /` - Root endpoint
- `GET /health` - Health check
- `POST /api/chat` - Chat with AI (coming soon)
- `GET /api/buses/search` - Search buses (coming soon)
- `POST /api/bookings` - Create booking (coming soon)

## Development

### Backend Development
```bash
cd backend
.\venv\Scripts\activate  # Windows
uvicorn app.main:app --reload
```

### Frontend Development
```bash
cd frontend
npm run dev
```

## Testing

### Test Backend
```bash
# Test API endpoints
curl http://localhost:8000
curl http://localhost:8000/health
```

### Test Frontend
Visit `http://localhost:5173` in your browser

## Features (Planned)

- ✅ Backend foundation with FastAPI
- ⏳ RAG knowledge base with ChromaDB
- ⏳ AI chatbot with Gemini integration
- ⏳ Bus search and filtering
- ⏳ Booking management
- ⏳ Modern UI with Material-UI
- ⏳ Real-time chat interface

## License

MIT
