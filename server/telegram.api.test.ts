import { describe, it, expect } from 'vitest';

/**
 * Test Telegram Bot API connection
 * 
 * This test validates that the VITE_TELEGRAM_BOT_TOKEN is correctly configured
 * by calling the Telegram Bot API getMe endpoint.
 */

describe('Telegram Bot API Integration', () => {
  const TELEGRAM_BOT_TOKEN = process.env.VITE_TELEGRAM_BOT_TOKEN;
  const TELEGRAM_BOT_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

  it('should have VITE_TELEGRAM_BOT_TOKEN configured', () => {
    expect(TELEGRAM_BOT_TOKEN).toBeDefined();
    expect(TELEGRAM_BOT_TOKEN).not.toBe('');
  });

  it('should have VITE_WEB_CHAT_ID configured', () => {
    const WEB_CHAT_ID = process.env.VITE_WEB_CHAT_ID;
    expect(WEB_CHAT_ID).toBeDefined();
    expect(WEB_CHAT_ID).not.toBe('');
  });

  it('should successfully connect to Telegram Bot API with valid token', async () => {
    if (!TELEGRAM_BOT_TOKEN) {
      throw new Error('VITE_TELEGRAM_BOT_TOKEN is not configured');
    }

    // Call Telegram Bot API getMe endpoint
    const response = await fetch(`${TELEGRAM_BOT_API}/getMe`);
    const data = await response.json();

    // Validate response
    expect(response.ok).toBe(true);
    expect(data.ok).toBe(true);
    expect(data.result).toBeDefined();
    expect(data.result.is_bot).toBe(true);
    expect(data.result.username).toBeDefined();

    console.log(`✅ Connected to Telegram bot: @${data.result.username}`);
  }, 10000); // 10 second timeout for API call
});
