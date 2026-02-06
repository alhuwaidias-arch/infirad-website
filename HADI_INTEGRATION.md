# Hadi AI Chat Agent Integration

This document describes the Hadi AI chat agent integration in the INFIRAD website.

## Overview

Hadi (هادي) is an intelligent chat agent that serves as the initial point of contact for INFIRAD website visitors. The agent:
- Communicates professionally in Arabic and English
- Explains INFIRAD's services at a high level
- Understands client needs and collects structured requests
- Forwards qualified leads to INFIRAD's technical team

## Architecture

### Backend (Python FastAPI)
- **Location:** `hadi-api/`
- **Main Files:**
  - `web_api.py` - FastAPI server with REST endpoints
  - `hadi_agent.py` - Core AI agent logic using LangChain
  - `database.py` - SQLite database for conversations and requests
  - `Hadi.txt` - Agent personality and behavior instructions
  - `company-docs/` - INFIRAD company profile PDFs for RAG

### Middleware (Express Proxy)
- **Location:** `server/_core/index.ts`
- **Function:** Starts Python subprocess and proxies `/api/hadi/*` requests to `http://127.0.0.1:8000`

### Frontend (React)
- **Chat Widget:** `client/src/components/ChatWidget.tsx`
- **API Service:** `client/src/services/hadiApi.ts`
- **Endpoint:** `/api/hadi` (proxied to Python backend)

## Technology Stack

### Python Backend
- **FastAPI** - Web framework
- **LangChain** - AI orchestration
- **LangGraph** - Conversational workflow
- **DeepSeek V3** - LLM model (via OpenAI-compatible API)
- **FAISS** - Vector store for document retrieval
- **Sentence Transformers** - Embeddings for RAG
- **SQLite** - Local database

### Node.js Integration
- **http-proxy-middleware** - API proxy
- **child_process** - Python subprocess management

## Installation

### 1. Install Python Dependencies

```bash
pnpm run install:hadi
```

This installs all required Python packages from `hadi-api/requirements.txt`.

### 2. Verify Environment Variables

The following environment variables are automatically configured:
- `DEEPSEEK_API_KEY` - For DeepSeek AI model
- `OPENAI_API_KEY` - For embeddings (optional)

These are inherited by the Python subprocess from the Node.js environment.

## Running the Application

### Development Mode

```bash
pnpm run dev
```

This command:
1. Starts the Express server
2. Automatically launches the Python Hadi API subprocess on port 8000
3. Starts Vite dev server for the frontend
4. Proxies `/api/hadi/*` requests to the Python API

### Production Mode

```bash
pnpm run build
pnpm start
```

## API Endpoints

### Health Check
```
GET /api/hadi/health
```

Returns the health status of the Hadi API.

### Create Session
```
POST /api/hadi/session/new
```

Creates a new chat session and returns a `session_id`.

### Send Message
```
POST /api/hadi/chat
Content-Type: application/json

{
  "session_id": "string",
  "message": "string"
}
```

Sends a message to Hadi and receives an AI-generated response.

### API Documentation
```
GET /api/hadi/docs
```

Interactive Swagger UI documentation for all endpoints.

## Database

The Python backend uses SQLite (`hadi-api/hadi_data.db`) with three tables:

1. **sessions** - Chat sessions with metadata
2. **chat_history** - All messages in conversations
3. **client_requests** - Structured client requests with email addresses

Client requests are also saved as JSON files in `hadi-api/requests/` for backup.

## RAG (Retrieval-Augmented Generation)

Hadi uses company profile PDFs to provide accurate information about INFIRAD:

**Documents:**
- `INFIRAD-Overview.pdf`
- `INFIRAD.pdf`
- `انفِراد.pdf`
- `_انفِراد-نبذة.pdf`
- `SERVICES.pdf`

These documents are:
1. Loaded at startup
2. Converted to embeddings using Sentence Transformers
3. Stored in a FAISS vector store
4. Retrieved dynamically based on user queries

## Conversation Flow

1. User opens chat widget
2. Frontend creates a new session via `/api/hadi/session/new`
3. Hadi sends initial greeting
4. User sends messages via `/api/hadi/chat`
5. Hadi:
   - Retrieves relevant context from company documents
   - Generates intelligent response using DeepSeek AI
   - Extracts email address if provided
   - Determines if enough information collected
6. When ready, Hadi automatically submits the request to the database
7. Request is saved for INFIRAD team review

## Agent Behavior

Hadi is configured with strict guidelines (see `Hadi.txt`):

**Allowed:**
- Explain INFIRAD services at a high level
- Ask clarifying questions
- Collect contact information
- Forward requests to technical team

**Not Allowed:**
- Provide prices or cost estimates
- Commit to timelines or deliverables
- Provide technical solutions
- Act as a consultant or engineer
- Approve or reject projects

## Troubleshooting

### Python API Not Starting

**Check Python installation:**
```bash
python3 --version
```

**Install dependencies manually:**
```bash
cd hadi-api
pip3 install -r requirements.txt
```

### Port 8000 Already in Use

The Python API runs on port 8000. If this port is busy:
1. Stop any process using port 8000
2. Or modify the port in `server/_core/index.ts` (line 23)

### Missing Company Documents

If PDFs are missing, the agent will still work but without document-based context. Ensure all PDFs are in `hadi-api/company-docs/`.

### Database Errors

If database errors occur:
1. Delete `hadi-api/hadi_data.db`
2. Restart the server (database will be recreated automatically)

## Deployment Considerations

### Environment Requirements
- **Python 3.8+** with pip
- **Node.js 22+** with pnpm
- **Sufficient memory** for vector store (approximately 500MB)

### Recommended Platforms
- **Railway** - Supports both Node.js and Python
- **Fly.io** - Docker deployment with both runtimes
- **DigitalOcean App Platform** - Multi-runtime support
- **AWS EC2** - Full control over environment

### GitHub Pages Limitation
⚠️ **GitHub Pages cannot run the Python backend** as it only serves static files. The chat widget will show connection errors on GitHub Pages deployment.

For production deployment with Hadi AI, use a platform that supports both Node.js and Python runtimes.

## Security Notes

- API keys are stored as environment variables (never committed to git)
- Python subprocess inherits environment from Node.js process
- SQLite database is local and not exposed via API
- All client requests are logged for INFIRAD team review
- No sensitive data is sent to external services except AI API calls

## Future Enhancements

Potential improvements:
- [ ] Add authentication for admin panel to view requests
- [ ] Implement email notifications when new requests arrive
- [ ] Add analytics dashboard for conversation metrics
- [ ] Support file uploads (PDFs, images) in chat
- [ ] Add voice input/output capabilities
- [ ] Implement multi-language support beyond Arabic/English
- [ ] Add integration with CRM systems

## Support

For issues or questions about the Hadi integration:
1. Check the logs in `hadi-api/` directory
2. Review the API documentation at `/api/hadi/docs`
3. Examine the database at `hadi-api/hadi_data.db`
4. Contact the development team

---

**Last Updated:** February 6, 2026
**Version:** 1.0.0
