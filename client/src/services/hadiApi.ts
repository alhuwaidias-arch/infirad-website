/**
 * Hadi AI Chat API Service - Direct Telegram Bot API Integration
 * 
 * This service communicates directly with Telegram Bot API to send/receive messages
 * from the local Hadi bot running on your PC. Zero hosting costs!
 * 
 * Protocol: [WEB:session_id] message_text
 */

const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const TELEGRAM_BOT_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

// Chat ID where web messages will be sent (your Telegram user ID or group ID)
const WEB_CHAT_ID = import.meta.env.VITE_WEB_CHAT_ID;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface ChatResponse {
  response: string;
  session_id: string;
}

export interface SessionResponse {
  session_id: string;
  message: string;
}

class HadiApiService {
  private sessionId: string = '';
  private lastUpdateId: number = 0;

  /**
   * Create a new chat session
   */
  async createSession(): Promise<SessionResponse> {
    // Generate a random session ID
    this.sessionId = Math.random().toString(36).substring(2, 15);
    
    return {
      session_id: this.sessionId,
      message: 'Session created successfully'
    };
  }

  /**
   * Send a message to Hadi via Telegram Bot API
   */
  async sendMessage(sessionId: string, message: string): Promise<ChatResponse> {
    try {
      if (!TELEGRAM_BOT_TOKEN || !WEB_CHAT_ID) {
        throw new Error('Telegram configuration missing. Please set VITE_TELEGRAM_BOT_TOKEN and VITE_WEB_CHAT_ID');
      }

      // Update session ID
      this.sessionId = sessionId;

      // Format message with web marker
      const webMessage = `[WEB:${sessionId}] ${message}`;

      // Send to Telegram Bot API
      const sendResponse = await fetch(
        `${TELEGRAM_BOT_API}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: WEB_CHAT_ID,
            text: webMessage,
          })
        }
      );

      if (!sendResponse.ok) {
        const errorData = await sendResponse.json();
        console.error('Telegram API error:', errorData);
        throw new Error('Failed to send message to Telegram');
      }

      // Poll for response (max 30 seconds)
      const response = await this.pollForResponse(sessionId, 30);

      return {
        response: response || 'عذراً، لم أتمكن من الرد في الوقت المناسب. الرجاء المحاولة مرة أخرى.\n\nSorry, I couldn\'t respond in time. Please try again.',
        session_id: sessionId
      };

    } catch (error) {
      console.error('Error sending message:', error);
      return {
        response: 'عذراً، حدث خطأ في الاتصال. تأكد من أن بوت Hadi يعمل على جهازك.\n\nSorry, connection error. Make sure Hadi bot is running on your PC.',
        session_id: sessionId
      };
    }
  }

  /**
   * Poll Telegram Bot API for Hadi's response
   */
  private async pollForResponse(sessionId: string, timeoutSeconds: number): Promise<string | null> {
    const startTime = Date.now();
    const timeout = timeoutSeconds * 1000;
    const marker = `[WEB:${sessionId}]`;

    while (Date.now() - startTime < timeout) {
      try {
        // Get updates from Telegram Bot API
        const response = await fetch(
          `${TELEGRAM_BOT_API}/getUpdates?offset=${this.lastUpdateId + 1}&timeout=1`
        );

        if (!response.ok) {
          console.error('Failed to get updates from Telegram');
          continue;
        }

        const data = await response.json();

        if (data.ok && data.result && data.result.length > 0) {
          // Process updates
          for (const update of data.result) {
            this.lastUpdateId = update.update_id;

            // Check if this is a response to our session
            const text = update.message?.text;
            if (text && text.includes(marker)) {
              // Extract the actual message (remove the marker)
              const cleanResponse = text.replace(marker, '').trim();
              return cleanResponse;
            }
          }
        }

        // Wait a bit before next poll
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error('Error polling for response:', error);
      }
    }

    return null; // Timeout
  }

  /**
   * Check if Telegram Bot API is accessible
   */
  async checkHealth(): Promise<{ status: string; message: string }> {
    try {
      if (!TELEGRAM_BOT_TOKEN) {
        return {
          status: 'error',
          message: 'VITE_TELEGRAM_BOT_TOKEN not configured'
        };
      }

      const response = await fetch(`${TELEGRAM_BOT_API}/getMe`);
      const data = await response.json();

      if (data.ok) {
        return {
          status: 'ok',
          message: `Connected to bot: ${data.result.username}`
        };
      } else {
        return {
          status: 'error',
          message: 'Invalid bot token'
        };
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'Cannot reach Telegram API'
      };
    }
  }
}

// Export singleton instance
export const hadiApi = new HadiApiService();

// Export functions for backward compatibility
export async function createSession(): Promise<SessionResponse> {
  return hadiApi.createSession();
}

export async function sendMessage(sessionId: string, message: string): Promise<ChatResponse> {
  return hadiApi.sendMessage(sessionId, message);
}

export async function checkHealth() {
  return hadiApi.checkHealth();
}
