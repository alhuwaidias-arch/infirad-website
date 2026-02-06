/**
 * Hadi AI Chat API Service
 * Handles communication with the Hadi AI agent through Express proxy
 */

const HADI_API_URL = import.meta.env.VITE_HADI_API_URL || '/api/hadi';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface ChatResponse {
  response: string;
  session_id: string;
  email_captured?: boolean;
  ready_to_submit?: boolean;
}

export interface SessionResponse {
  session_id: string;
  message: string;
}

export interface HealthResponse {
  status: string;
  message: string;
}

/**
 * Create a new chat session
 */
export async function createSession(): Promise<SessionResponse> {
  try {
    const response = await fetch(`${HADI_API_URL}/session/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
}

/**
 * Send a message to Hadi AI
 */
export async function sendMessage(
  sessionId: string,
  message: string
): Promise<ChatResponse> {
  try {
    const response = await fetch(`${HADI_API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        message: message,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

/**
 * Check API health
 */
export async function checkHealth(): Promise<HealthResponse> {
  try {
    const response = await fetch(`${HADI_API_URL}/health`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking health:', error);
    throw error;
  }
}
