# AI RAG Chatbot for Bus Ticket Booking

An intelligent bus ticket booking application that leverages Retrieval-Augmented Generation (RAG) to provide a conversational interface for searching buses, viewing routes, and managing bookings. Built with a modern tech stack featuring FastAPI, LangChain, and React.

## 🚀 Features

- **AI Chat Assistant**: Conversational interface powered by Google Gemini and RAG to answer queries about bus schedules, routes, and policies.
- **Smart Search**: Search for buses between districts with real-time availability.
- **Booking Management**: Complete booking flow including seat selection, passenger details, and booking confirmation.
- **My Bookings**: View and manage your past and upcoming bookings.
- **Admin Dashboard**: (Planned) Interface for bus operators to manage schedules and fleet.

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **LLM & RAG**: LangChain, Google Gemini API
- **Vector DB**: ChromaDB (for document embeddings)
- **Database**: PostgreSQL (via SQLAlchemy & Alembic)
- **Containerization**: Docker & Docker Compose

### Frontend
- **Framework**: React (Vite)
- **Language**: TypeScript
- **UI Library**: Material UI (MUI)
- **State Management**: Zustand, TanStack Query

## 📋 Prerequisites

Ensure you have the following installed:
- **Python** 3.10+
- **Node.js** 18+
- **Docker** & **Docker Compose**
- **Git**

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Tanjim-Noor/Ticket-Booking-AI.git
cd Ticket-Booking-AI
```

### 2. Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create and activate a virtual environment:**
    ```bash
    python -m venv venv
    # Windows
    .\venv\Scripts\activate
    # Linux/Mac
    source venv/bin/activate
    ```

3.  **Install Python dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure Environment Variables:**
    Create a `.env` file in the `backend` directory and add the following:
    ```env
    DATABASE_URL=postgresql://user:password@localhost:5432/ticket_booking_db
    GOOGLE_API_KEY=your_google_gemini_api_key
    # Optional: LangSmith for tracing
    LANGSMITH_TRACING=true
    LANGSMITH_API_KEY=your_langsmith_api_key
    ```

5.  **Start Infrastructure (PostgreSQL & ChromaDB):**
    ```bash
    cd docker
    docker-compose up -d
    cd ..
    ```

6.  **Run Database Migrations:**
    ```bash
    alembic upgrade head
    ```

7.  **Start the Backend Server:**
    ```bash
    uvicorn app.main:app --reload
    ```
    The API will be available at `http://localhost:8000`.
    API Documentation (Swagger UI): `http://localhost:8000/docs`.

### 3. Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install Node dependencies:**
    ```bash
    npm install
    ```

3.  **Start the Development Server:**
    ```bash
    npm run dev
    ```
    The application will be running at `http://localhost:5173`.

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Required |
| :--- | :--- | :--- |
| `DATABASE_URL` | Connection string for PostgreSQL | Yes |
| `GOOGLE_API_KEY` | API Key for Google Gemini | Yes |
| `LANGSMITH_TRACING` | Enable LangSmith tracing (true/false) | No |
| `LANGSMITH_API_KEY` | API Key for LangSmith | No |

### Frontend (`frontend/.env`)

| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_API_URL` | Backend API URL | `http://localhost:8000` |

## 📚 Documentation

- **API Docs**: Visit `/docs` on the backend server (e.g., `http://localhost:8000/docs`) to explore the REST API endpoints.
- **Database Schema**: The database schema is managed via Alembic migrations in `backend/alembic`.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
