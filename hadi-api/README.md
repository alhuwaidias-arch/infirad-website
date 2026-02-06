# Hadi AI Agent - Python FastAPI Service

This folder contains the Hadi AI chat agent backend.

## Files

- **web_api.py** - FastAPI server with all API endpoints
- **hadi_agent.py** - Core AI agent logic using LangChain
- **database.py** - SQLite database for storing conversations and client requests
- **requirements.txt** - Python dependencies
- **Hadi.txt** - Agent's personality and instructions
- **.env** - API keys (ANTHROPIC_API_KEY, DEEPSEEK_API_KEY)

## Installation

```bash
pip install -r requirements.txt
```

## Running Standalone

```bash
python -m uvicorn web_api:app --host 127.0.0.1 --port 8000
```

## API Endpoints

- `GET /health` - Health check
- `POST /session/new` - Create new chat session
- `POST /chat` - Send message and get AI response
- `GET /docs` - API documentation (Swagger UI)

## Integration

This service is designed to be started as a subprocess by the Express server.
See `server/index.ts` for the integration code.

## Environment Variables

Required in `.env` file:
- `ANTHROPIC_API_KEY` - For Claude AI
- `DEEPSEEK_API_KEY` - For DeepSeek AI (backup model)

## Database

Uses SQLite (`hadi_data.db`) with three tables:
1. `sessions` - Chat sessions
2. `chat_history` - All messages
3. `client_requests` - Contact form submissions

Data is stored locally and persists between restarts.
