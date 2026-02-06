"""
Hadi Agent Core - Reusable agent logic for multiple interfaces
Can be used by CLI, Telegram, web, or any other interface
"""

import os
import re
import json
from pathlib import Path
from typing import TypedDict, Annotated, Sequence, Dict, Any
from datetime import datetime

from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages


# ============================================================================
# Configuration
# ============================================================================

# Load environment variables
load_dotenv()

# Get the directory where this script is located
SCRIPT_DIR = Path(__file__).parent.resolve()

# Paths (relative to script directory)
COMPANY_DOCS_PATH = SCRIPT_DIR / "company-docs"
HADI_INSTRUCTIONS_PATH = SCRIPT_DIR / "Hadi.txt"
REQUESTS_DIR = SCRIPT_DIR / "requests"

# Model configuration - Using DeepSeek-V3.2 (OpenAI-compatible API)
MODEL_NAME = "deepseek-chat"  # DeepSeek-V3.2 model identifier
# Alternative: "deepseek-reasoner" for reasoning model


# ============================================================================
# State Definition
# ============================================================================

class AgentState(TypedDict):
    """State for the conversational agent."""
    messages: Annotated[Sequence[BaseMessage], add_messages]
    context: str
    email: str
    request_summary: str
    ready_to_submit: bool
    user_id: str  # For tracking (telegram_id, session_id, etc.)


# ============================================================================
# Utility Functions
# ============================================================================

def load_hadi_instructions():
    """Load Hadi's personality and behavior instructions."""
    try:
        instructions_path = Path(HADI_INSTRUCTIONS_PATH)
        if instructions_path.exists():
            with open(instructions_path, 'r', encoding='utf-8') as f:
                return f.read()
        else:
            print(f"[WARNING] Hadi.txt not found at {HADI_INSTRUCTIONS_PATH}")
            return ""
    except Exception as e:
        print(f"[ERROR] Failed to load Hadi instructions: {e}")
        return ""


def extract_email(text: str) -> str:
    """Extract email address from text using regex."""
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    matches = re.findall(email_pattern, text)
    return matches[0] if matches else ""


def save_request(state: AgentState):
    """Save the client request to a JSON file."""
    try:
        requests_dir = Path(REQUESTS_DIR)
        requests_dir.mkdir(parents=True, exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"request_{timestamp}.json"
        filepath = requests_dir / filename
        
        request_data = {
            "timestamp": datetime.now().isoformat(),
            "user_id": state.get("user_id", "unknown"),
            "email": state.get("email", ""),
            "summary": state.get("request_summary", ""),
            "conversation": [
                {
                    "role": "user" if isinstance(msg, HumanMessage) else "assistant",
                    "content": msg.content
                }
                for msg in state["messages"]
            ]
        }
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(request_data, f, ensure_ascii=False, indent=2)
        
        print(f"[INFO] Request saved to: {filepath}")
        return True
        
    except Exception as e:
        print(f"[ERROR] Failed to save request: {e}")
        return False


# ============================================================================
# Document Loading
# ============================================================================

def load_company_documents():
    """Load and process all PDF documents from the company profile folder."""
    try:
        docs_path = Path(COMPANY_DOCS_PATH)
        
        if not docs_path.exists():
            print(f"[WARNING] Company documents folder not found at {COMPANY_DOCS_PATH}")
            return None
        
        pdf_files = list(docs_path.glob("*.pdf"))
        
        if not pdf_files:
            print(f"[WARNING] No PDF files found in {COMPANY_DOCS_PATH}")
            return None
        
        print(f"[INFO] Loading {len(pdf_files)} company documents...")
        
        all_documents = []
        for pdf_file in pdf_files:
            try:
                loader = PyPDFLoader(str(pdf_file))
                documents = loader.load()
                all_documents.extend(documents)
                print(f"   [OK] Loaded: {pdf_file.name}")
            except Exception as e:
                print(f"   [ERROR] Error loading {pdf_file.name}: {e}")
        
        if not all_documents:
            print("[WARNING] No documents could be loaded")
            return None
        
        print("[INFO] Creating vector store (this may take a moment)...")
        embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        vectorstore = FAISS.from_documents(all_documents, embeddings)
        print("[SUCCESS] Vector store created successfully\n")
        
        return vectorstore
        
    except Exception as e:
        print(f"[ERROR] Error loading company documents: {e}")
        return None


# ============================================================================
# Agent Workflow Functions
# ============================================================================

def retrieve_context(state: AgentState, vectorstore) -> AgentState:
    """Retrieve relevant context from company documents."""
    last_message = state["messages"][-1]
    
    if vectorstore and isinstance(last_message, HumanMessage):
        try:
            docs = vectorstore.similarity_search(last_message.content, k=3)
            context = "\n\n".join([doc.page_content for doc in docs])
            state["context"] = context
        except Exception as e:
            print(f"[WARNING] Error retrieving context: {e}")
            state["context"] = ""
    else:
        state["context"] = ""
    
    return state


def extract_info(state: AgentState) -> AgentState:
    """Extract email and check if we have enough information to submit."""
    if not state.get("email"):
        for msg in state["messages"]:
            if isinstance(msg, HumanMessage):
                email = extract_email(msg.content)
                if email:
                    state["email"] = email
                    break
    
    user_messages = [msg for msg in state["messages"] if isinstance(msg, HumanMessage)]
    state["ready_to_submit"] = bool(state.get("email") and len(user_messages) >= 2)
    
    return state


def generate_response(state: AgentState, llm: ChatOpenAI, hadi_instructions: str) -> AgentState:
    """Generate a response using the LLM with Hadi's personality."""
    context_section = ""
    if state.get("context"):
        context_section = f"""
COMPANY INFORMATION CONTEXT (from INFIRAD profile documents):
{state['context']}

Use this context to answer questions about INFIRAD at a high level only.
"""
    
    system_prompt = f"""{hadi_instructions}

{context_section}

CURRENT CONVERSATION STATE:
- Email collected: {"Yes (" + state.get("email", "") + ")" if state.get("email") else "No"}
- Ready to submit: {"Yes" if state.get("ready_to_submit") else "No"}

INSTRUCTIONS:
- If you have collected the email and understood the request, automatically proceed with submission
- Inform the user that their request will be forwarded to INFIRAD's technical team
- Do not ask for confirmation once you have email and request details
"""
    
    system_message = SystemMessage(content=system_prompt)
    messages = [system_message] + list(state["messages"])
    
    try:
        response = llm.invoke(messages)
        state["messages"] = state["messages"] + [response]
        
        if state.get("ready_to_submit"):
            user_messages = [msg.content for msg in state["messages"] if isinstance(msg, HumanMessage)]
            state["request_summary"] = " | ".join(user_messages[:3])
            
    except Exception as e:
        error_message = AIMessage(content=f"I apologize, but I encountered an error: {str(e)}")
        state["messages"] = state["messages"] + [error_message]
    
    return state


def submit_request(state: AgentState) -> AgentState:
    """Submit the request if ready."""
    if state.get("ready_to_submit") and state.get("email"):
        success = save_request(state)
        if success:
            print(f"\n[SUCCESS] Request forwarded for email: {state['email']}\n")
    
    return state


# ============================================================================
# Agent Initialization
# ============================================================================

class HadiAgent:
    """Hadi Agent - Reusable conversational agent."""
    
    def __init__(self):
        """Initialize the Hadi agent."""
        print("[INFO] Initializing Hadi agent...")
        
        # Load instructions
        self.hadi_instructions = load_hadi_instructions()
        if not self.hadi_instructions:
            print("[WARNING] Running without Hadi personality instructions")
        
        # Load company documents
        self.vectorstore = load_company_documents()
        
        # Initialize LLM - Using DeepSeek-V3.2
        api_key = os.getenv("DEEPSEEK_API_KEY")
        if not api_key:
            raise ValueError("DEEPSEEK_API_KEY not found in environment variables")
        
        self.llm = ChatOpenAI(
            model=MODEL_NAME,
            openai_api_key=api_key,
            base_url="https://api.deepseek.com/v1",
            temperature=0.7,
            max_tokens=2048
        )
        
        # Create the graph
        self.agent = self._create_graph()
        
        print("[SUCCESS] Hadi agent initialized\n")
    
    def _create_graph(self):
        """Create the LangGraph workflow."""
        workflow = StateGraph(AgentState)
        
        workflow.add_node("retrieve", lambda state: retrieve_context(state, self.vectorstore))
        workflow.add_node("extract", extract_info)
        workflow.add_node("generate", lambda state: generate_response(state, self.llm, self.hadi_instructions))
        workflow.add_node("submit", submit_request)
        
        workflow.set_entry_point("retrieve")
        workflow.add_edge("retrieve", "extract")
        workflow.add_edge("extract", "generate")
        workflow.add_edge("generate", "submit")
        workflow.add_edge("submit", END)
        
        return workflow.compile()
    
    def create_initial_state(self, user_id: str = "unknown") -> Dict[str, Any]:
        """Create initial state for a new conversation."""
        return {
            "messages": [],
            "context": "",
            "email": "",
            "request_summary": "",
            "ready_to_submit": False,
            "user_id": user_id
        }
    
    def process_message(self, state: Dict[str, Any], message: str) -> Dict[str, Any]:
        """Process a user message and return updated state."""
        # Add user message
        state["messages"].append(HumanMessage(content=message))
        
        # Run agent
        result = self.agent.invoke(state)
        
        return result
    
    def get_last_response(self, state: Dict[str, Any]) -> str:
        """Get the last assistant response from state."""
        for msg in reversed(state["messages"]):
            if isinstance(msg, AIMessage):
                return msg.content
        return ""
