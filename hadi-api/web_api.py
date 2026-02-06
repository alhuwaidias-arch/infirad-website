"""
FastAPI Web API for Hadi Chat Agent
Provides REST API endpoints for website integration
"""

import os
import json
import uuid
import asyncio
from typing import Dict, Optional
from datetime import datetime
from pathlib import Path

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import uvicorn

from hadi_agent import HadiAgent
from database import HadiDatabase


# ============================================================================
# Configuration
# ============================================================================

# Initialize FastAPI app
app = FastAPI(
    title="Hadi Chat API",
    description="REST API for INFIRAD's Hadi chat agent",
    version="1.0.0"
)

# CORS configuration (allow all origins for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables
hadi_agent = None
hadi_db = None  # Database for storing requests and chat history
user_sessions: Dict[str, Dict] = {}  # session_id -> state
session_timeouts: Dict[str, datetime] = {}  # session_id -> last activity


# ============================================================================
# Data Models
# ============================================================================

class ChatMessage(BaseModel):
    """Request model for sending a chat message."""
    message: str
    session_id: Optional[str] = None
    user_id: Optional[str] = None


class ChatResponse(BaseModel):
    """Response model for chat messages."""
    response: str
    session_id: str
    email_collected: bool
    email: Optional[str] = None
    ready_to_submit: bool
    request_submitted: bool = False


class SessionInfo(BaseModel):
    """Information about a user session."""
    session_id: str
    created_at: str
    last_activity: str
    message_count: int
    email_collected: bool
    email: Optional[str] = None


# ============================================================================
# Session Management
# ============================================================================

def create_session(user_id: str = None) -> str:
    """Create a new chat session."""
    session_id = str(uuid.uuid4())

    # Initialize state
    user_sessions[session_id] = hadi_agent.create_initial_state(
        user_id=user_id or f"web_user_{session_id[:8]}"
    )

    # Set initial timeout
    session_timeouts[session_id] = datetime.now()

    # Save to database
    hadi_db.create_session(session_id)

    print(f"[API] Created new session: {session_id}")
    return session_id


def get_session(session_id: str) -> Dict:
    """Get session state, creating if it doesn't exist."""
    if session_id not in user_sessions:
        # Create new session if doesn't exist
        session_id = create_session()
        return user_sessions[session_id]
    
    # Update last activity
    session_timeouts[session_id] = datetime.now()
    
    return user_sessions[session_id]


def cleanup_old_sessions(hours: int = 24):
    """Clean up sessions older than specified hours."""
    now = datetime.now()
    to_delete = []
    
    for session_id, last_activity in session_timeouts.items():
        if (now - last_activity).total_seconds() > hours * 3600:
            to_delete.append(session_id)
    
    for session_id in to_delete:
        del user_sessions[session_id]
        del session_timeouts[session_id]
        print(f"[API] Cleaned up old session: {session_id}")


# ============================================================================
# API Endpoints
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """Initialize Hadi agent and database on startup."""
    global hadi_agent, hadi_db
    print("[API] Starting Hadi Web API...")
    hadi_agent = HadiAgent()
    hadi_db = HadiDatabase()
    print("[API] Hadi agent initialized")
    print("[API] Database initialized")


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "service": "Hadi Chat API",
        "version": "1.0.0",
        "description": "REST API for INFIRAD's Hadi chat agent",
        "endpoints": {
            "/": "This info page",
            "/chat": "POST - Send chat message",
            "/session/new": "GET - Create new session",
            "/session/{session_id}": "GET - Get session info",
            "/widget": "GET - Chat widget HTML",
            "/widget.js": "GET - Chat widget JavaScript",
            "/health": "GET - Health check"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "hadi-chat-api",
        "timestamp": datetime.now().isoformat(),
        "sessions_active": len(user_sessions)
    }


@app.post("/chat", response_model=ChatResponse)
async def chat(message_data: ChatMessage):
    """Handle chat messages."""
    try:
        # Get or create session
        session_id = message_data.session_id
        if not session_id:
            session_id = create_session(message_data.user_id)

        state = get_session(session_id)

        # Save user message to database
        hadi_db.save_chat_message(
            session_id=session_id,
            role="user",
            content=message_data.message,
            email=state.get("email"),
            language=state.get("language", "ar")
        )

        # Process message
        updated_state = hadi_agent.process_message(state, message_data.message)
        user_sessions[session_id] = updated_state

        # Get response
        response_text = hadi_agent.get_last_response(updated_state)

        # Save assistant response to database
        hadi_db.save_chat_message(
            session_id=session_id,
            role="assistant",
            content=response_text,
            email=updated_state.get("email"),
            language=updated_state.get("language", "ar")
        )

        # Update session in database
        hadi_db.update_session(
            session_id=session_id,
            email=updated_state.get("email"),
            increment_messages=True
        )

        # Check if request was submitted
        request_submitted = False
        if updated_state.get("ready_to_submit") and updated_state.get("email"):
            request_submitted = True

            # Save client request to database
            hadi_db.save_client_request(
                session_id=session_id,
                email=updated_state.get("email"),
                name=updated_state.get("name"),
                phone=updated_state.get("phone"),
                company=updated_state.get("company"),
                project_type=updated_state.get("project_type"),
                project_description=updated_state.get("project_description"),
                language=updated_state.get("language", "ar")
            )

            # Update session
            hadi_db.update_session(
                session_id=session_id,
                request_submitted=True
            )

            print(f"[API] Client request submitted for session {session_id}")

        return ChatResponse(
            response=response_text,
            session_id=session_id,
            email_collected=bool(updated_state.get("email")),
            email=updated_state.get("email"),
            ready_to_submit=updated_state.get("ready_to_submit", False),
            request_submitted=request_submitted
        )

    except Exception as e:
        print(f"[API] Error processing chat: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing message: {str(e)}")


@app.get("/session/new")
async def new_session(user_id: Optional[str] = None):
    """Create a new chat session."""
    session_id = create_session(user_id)
    return {
        "session_id": session_id,
        "message": "New session created",
        "timestamp": datetime.now().isoformat()
    }


@app.get("/session/{session_id}")
async def get_session_info(session_id: str):
    """Get information about a session."""
    if session_id not in user_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    state = user_sessions[session_id]
    last_activity = session_timeouts.get(session_id, datetime.now())
    
    # Count messages
    message_count = len(state.get("messages", []))
    
    return SessionInfo(
        session_id=session_id,
        created_at=last_activity.isoformat(),
        last_activity=last_activity.isoformat(),
        message_count=message_count,
        email_collected=bool(state.get("email")),
        email=state.get("email")
    )


# ============================================================================
# Chat Widget Endpoints
# ============================================================================

@app.get("/widget", response_class=HTMLResponse)
async def chat_widget():
    """Return the chat widget HTML."""
    widget_html = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hadi - INFIRAD Chat</title>
    <link rel="stylesheet" href="/static/widget.css">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 0;
            background: #f5f5f5;
        }
        .chat-container {
            max-width: 800px;
            margin: 20px auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .chat-header {
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            color: white;
            padding: 20px;
            text-align: center;
        }
        .chat-header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .chat-header p {
            margin: 5px 0 0;
            opacity: 0.9;
            font-size: 14px;
        }
        .chat-messages {
            height: 400px;
            overflow-y: auto;
            padding: 20px;
            background: #f9fafb;
        }
        .message {
            margin-bottom: 16px;
            display: flex;
        }
        .message.user {
            justify-content: flex-end;
        }
        .message.bubble {
            max-width: 70%;
            padding: 12px 16px;
            border-radius: 18px;
            line-height: 1.4;
        }
        .message.user .bubble {
            background: #4f46e5;
            color: white;
            border-bottom-right-radius: 4px;
        }
        .message.assistant .bubble {
            background: white;
            color: #374151;
            border: 1px solid #e5e7eb;
            border-bottom-left-radius: 4px;
        }
        .message.typing .bubble {
            background: #f3f4f6;
            color: #6b7280;
            font-style: italic;
        }
        .chat-input {
            padding: 20px;
            border-top: 1px solid #e5e7eb;
            display: flex;
            gap: 10px;
        }
        .chat-input input {
            flex: 1;
            padding: 12px 16px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 16px;
            outline: none;
            transition: border-color 0.2s;
        }
        .chat-input input:focus {
            border-color: #4f46e5;
        }
        .chat-input button {
            padding: 12px 24px;
            background: #4f46e5;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.2s;
        }
        .chat-input button:hover {
            background: #4338ca;
        }
        .chat-input button:disabled {
            background: #9ca3af;
            cursor: not-allowed;
        }
        .status {
            padding: 10px 20px;
            background: #f0f9ff;
            border-top: 1px solid #e0f2fe;
            font-size: 14px;
            color: #0369a1;
            display: flex;
            justify-content: space-between;
        }
        .status .email {
            font-weight: 500;
        }
        .hidden {
            display: none;
        }
        @media (max-width: 640px) {
            .chat-container {
                margin: 0;
                border-radius: 0;
                height: 100vh;
            }
            .chat-messages {
                height: calc(100vh - 200px);
            }
        }
    </style>
</head>
<body>
    <div class="chat-container">
        <div class="chat-header">
            <h1>Hadi - INFIRAD Chat</h1>
            <p>Professional digital representative for INFIRAD company</p>
        </div>
        
        <div class="status hidden">
            <span>Session: <span id="session-id">-</span></span>
            <span>Email: <span id="email-status" class="email">Not collected</span></span>
        </div>
        
        <div class="chat-messages" id="chat-messages">
            <div class="message assistant">
                <div class="bubble">
                    Hello! 👋 I'm Hadi (هادي), the digital representative of INFIRAD (انفِراد).<br><br>
                    I'm here to help you understand INFIRAD's services and collect your project 
                    requirements for our technical team.<br><br>
                    Feel free to ask me about INFIRAD or tell me about your project needs. 
                    I can communicate in both English and Arabic.<br><br>
                    How can I assist you today?
                </div>
            </div>
        </div>
        
        <div class="chat-input">
            <input type="text" id="message-input" placeholder="Type your message here..." autocomplete="off">
            <button id="send-button">Send</button>
        </div>
    </div>

    <script src="/widget.js"></script>
</body>
</html>
    """
    return HTMLResponse(content=widget_html)


@app.get("/widget.js")
async def widget_js():
    """Return the chat widget JavaScript."""
    widget_js = """
// Hadi Chat Widget
class HadiChatWidget {
    constructor() {
        this.apiBase = window.location.origin;
        this.sessionId = null;
        this.isTyping = false;
        
        this.initialize();
    }
    
    async initialize() {
        // Get DOM elements
        this.messageInput = document.getElementById('message-input');
        this.sendButton = document.getElementById('send-button');
        this.chatMessages = document.getElementById('chat-messages');
        this.sessionIdSpan = document.getElementById('session-id');
        this.emailStatusSpan = document.getElementById('email-status');
        this.statusDiv = document.querySelector('.status');
        
        // Create new session
        await this.createSession();
        
        // Event listeners
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Show session ID in status
        if (this.sessionId) {
            this.sessionIdSpan.textContent = this.sessionId.substring(0, 8) + '...';
            this.statusDiv.classList.remove('hidden');
        }
    }
    
    async createSession() {
        try {
            const response = await fetch(`${this.apiBase}/session/new`);
            const data = await response.json();
            this.sessionId = data.session_id;
            console.log('Created session:', this.sessionId);
        } catch (error) {
            console.error('Failed to create session:', error);
            // Fallback: generate local session ID
            this.sessionId = 'local_' + Math.random().toString(36).substring(2, 9);
        }
    }
    
    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || this.isTyping) return;
        
        // Clear input
        this.messageInput.value = '';
        
        // Add user message to chat
        this.addMessage(message, 'user');
        
        // Show typing indicator
        this.showTyping();
        
        try {
            // Send to API
            const response = await fetch(`${this.apiBase}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    session_id: this.sessionId
                })
            });
            
            const data = await response.json();
            
            // Remove typing indicator
            this.removeTyping();
            
            // Add response to chat
            this.addMessage(data.response, 'assistant');
            
            // Update status
            this.updateStatus(data);
            
        } catch (error) {
            console.error('Failed to send message:', error);
            this.removeTyping();
            this.addMessage('Sorry, I encountered an error. Please try again.', 'assistant');
        }
    }
    
    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'bubble';
        bubbleDiv.textContent = text;
        
        messageDiv.appendChild(bubbleDiv);
        this.chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    showTyping() {
        this.isTyping = true;
        this.sendButton.disabled = true;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message assistant typing';
        typingDiv.id = 'typing-indicator';
        
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'bubble';
        bubbleDiv.textContent = 'Hadi is typing...';
        
        typingDiv.appendChild(bubbleDiv);
        this.chatMessages.appendChild(typingDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    removeTyping() {
        this.isTyping = false;
        this.sendButton.disabled = false;
        
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    updateStatus(data) {
        if (data.email_collected && data.email) {
            this.emailStatusSpan.textContent = data.email;
            this.emailStatusSpan.style.color = '#10b981';
        }
        
        if (data.request_submitted) {
            this.addMessage('✅ Your request has been forwarded to our technical team!', 'system');
        }
    }
}

// Initialize widget when page loads
document.addEventListener('DOMContentLoaded', () => {
    new HadiChatWidget();
});
    """
    return HTMLResponse(content=widget_js, media_type="application/javascript")


@app.get("/embed")
async def embed_instructions():
    """Instructions for embedding the chat widget."""
    return {
        "instructions": "To embed Hadi chat widget on your website:",
        "method1": {
            "description": "Embed as iframe (easiest)",
            "code": '<iframe src="http://your-domain:8000/widget" width="400" height="600" style="border:none;border-radius:12px;"></iframe>'
        },
        "method2": {
            "description": "Embed as JavaScript widget",
            "code": """
<script src="http://your-domain:8000/widget.js"></script>
<div id="hadi-chat-widget"></div>
<script>
    // Initialize widget
    new HadiChatWidget({
        apiBase: 'http://your-domain:8000',
        container: '#hadi-chat-widget'
    });
</script>
            """
        },
        "api_endpoints": {
            "chat": "POST /chat - Send message",
            "session": "GET /session/new - Create session"
        }
    }


# ============================================================================
# Static Files
# ============================================================================

# Create static directory
static_dir = Path(__file__).parent / "static"
static_dir.mkdir(exist_ok=True)

# Serve static files
app.mount("/static", StaticFiles(directory=static_dir), name="static")


# ============================================================================
# Main
# ============================================================================

if __name__ == "__main__":
    import os
    port = int(os.getenv("PORT", 8000))

    print("Starting Hadi Web API server...")
    print(f"API Documentation: http://localhost:{port}/docs")
    print(f"Chat Widget: http://localhost:{port}/widget")
    print(f"Embed Instructions: http://localhost:{port}/embed")

    uvicorn.run(
        "web_api:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )
