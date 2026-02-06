# Telegram Bridge Integration

This document describes the Telegram bridge that connects the INFIRAD website chat to your Telegram bot for manual handling.

## Overview

The Telegram bridge allows you to:
- ✅ Receive website chat messages directly in your Telegram
- ✅ Respond to customers from Telegram
- ✅ Manage all conversations from your phone
- ✅ Get instant notifications for new messages

## Architecture

### Components

1. **ChatWidget** (`client/src/components/ChatWidget.tsx`)
   - Website chat interface
   - Sends messages via tRPC to backend

2. **Telegram Router** (`server/telegramRouter.ts`)
   - tRPC endpoints for chat operations
   - Manages chat sessions and message history

3. **Telegram Bridge** (`server/telegramBridge.ts`)
   - Telegram bot using Telegraf library
   - Forwards messages between website and Telegram
   - Event-based real-time communication

4. **Server Integration** (`server/_core/index.ts`)
   - Initializes Telegram bot on startup
   - Manages bot lifecycle

## How It Works

### Message Flow: Website → Telegram

1. Visitor opens chat widget on website
2. Visitor sends a message
3. Frontend calls `trpc.telegram.sendMessage`
4. Backend forwards message to your Telegram bot
5. You receive notification in Telegram with:
   - Session ID
   - Visitor's message
   - User info (if provided)

### Message Flow: Telegram → Website

1. You reply in Telegram to the bot
2. Bot matches reply to session ID
3. Backend emits event for that session
4. Frontend receives message via WebSocket/polling
5. Message appears in website chat

## Setup Instructions

### Step 1: Get Your Telegram Bot Token

If you don't have a bot token yet:

1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Follow instructions to create your bot
4. Copy the bot token (format: `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`)

### Step 2: Configure Environment Variable

The bot token is already configured as `TELEGRAM_BOT_TOKEN` in your project.

### Step 3: Start Your Bot

1. Run the development server:
   ```bash
   pnpm run dev
   ```

2. You should see in the logs:
   ```
   ✅ [Telegram Bridge] Bot started successfully
   ```

### Step 4: Initialize Your Bot

1. Open Telegram and find your bot
2. Send `/start` command to your bot
3. Bot will respond with a welcome message

**Important:** You MUST send `/start` to your bot before website visitors can chat. This registers your Telegram account as the admin who will receive messages.

## Usage

### Receiving Messages

When a visitor sends a message on the website, you'll receive a Telegram message like:

```
🌐 New message from website
📝 Session: abc123xyz

Hello, I'm interested in your services.
```

### Replying to Messages

Simply reply to the bot in Telegram. Your message will automatically be sent back to the website chat for that session.

The visitor will see your reply in real-time on the website.

### Multiple Conversations

Each website chat session has a unique session ID. The bot tracks which Telegram conversation corresponds to which website session, so you can handle multiple customers simultaneously.

## API Endpoints (tRPC)

### `telegram.createSession`

Creates a new chat session.

```typescript
const { session_id } = await trpc.telegram.createSession.mutate();
```

### `telegram.sendMessage`

Sends a message from website to Telegram.

```typescript
await trpc.telegram.sendMessage.mutate({
  session_id: "abc123",
  message: "Hello!",
  user_info: {
    name: "John Doe",
    email: "john@example.com"
  }
});
```

### `telegram.getHistory`

Retrieves chat history for a session.

```typescript
const { messages } = await trpc.telegram.getHistory.query({
  session_id: "abc123"
});
```

### `telegram.onMessage` (Subscription)

Real-time subscription for incoming messages from Telegram.

```typescript
trpc.telegram.onMessage.subscribe(
  { session_id: "abc123" },
  {
    onData: (message) => {
      console.log("New message:", message);
    }
  }
);
```

## Technical Details

### Session Management

- Sessions are stored in-memory (Map)
- Each session has a unique ID (nanoid)
- Sessions persist until server restart
- For production, consider using Redis or database

### Message Storage

Currently, messages are stored in-memory. For production deployment, consider:
- Storing messages in database (MySQL/PostgreSQL)
- Using Redis for real-time session management
- Implementing message persistence for audit trail

### Bot Configuration

The bot uses the Telegraf library:
- **Library:** `telegraf` (v4.16.3)
- **Mode:** Long polling (default)
- **Webhook:** Not configured (can be added for production)

## Deployment Considerations

### Environment Variables

Ensure `TELEGRAM_BOT_TOKEN` is set in your deployment environment.

### Webhook vs Polling

**Current:** Long polling (suitable for development and low-traffic sites)

**For production:** Consider using webhooks for better performance:

```typescript
// In server/telegramBridge.ts
bot.telegram.setWebhook('https://yourdomain.com/api/telegram/webhook');
```

### Scaling

For high-traffic scenarios:
- Use Redis for session storage
- Implement message queue (RabbitMQ, Bull)
- Use webhook instead of polling
- Consider multiple bot instances with load balancing

## Troubleshooting

### Bot Not Receiving Messages

**Check:**
1. Is `TELEGRAM_BOT_TOKEN` set correctly?
2. Did you send `/start` to the bot?
3. Check server logs for `✅ [Telegram Bridge] Bot started successfully`

### Messages Not Forwarding

**Check:**
1. Session ID is valid
2. Bot has permission to send messages
3. Check console for errors

### Bot Stops Responding

**Solution:**
1. Restart the server
2. Send `/start` to bot again
3. Check Telegram API status

## Security Notes

- Bot token is stored as environment variable (never in code)
- Session IDs are randomly generated (nanoid)
- No authentication required for website chat (public access)
- Admin Telegram account receives all messages
- Consider adding rate limiting for production

## Future Enhancements

Potential improvements:
- [ ] Persistent message storage in database
- [ ] Support for multiple admin accounts
- [ ] Rich media support (images, files)
- [ ] Conversation analytics dashboard
- [ ] Auto-responder for common questions
- [ ] Integration with CRM systems
- [ ] Message templates for quick replies
- [ ] Conversation tagging and categorization

## Comparison with Hadi AI

| Feature | Telegram Bridge | Hadi AI |
|---------|----------------|---------|
| Response | Manual (you reply) | Automated (AI) |
| Setup | Simple (just bot token) | Complex (Python, dependencies) |
| Cost | Free | AI API costs |
| Personalization | High (human touch) | Medium (AI personality) |
| Response Time | Variable (depends on you) | Instant |
| Scalability | Limited (manual) | High (automated) |
| Best For | Personal service, complex queries | High volume, simple queries |

## Support

For issues or questions:
1. Check server logs in `.manus-logs/devserver.log`
2. Test bot with `/start` command
3. Verify `TELEGRAM_BOT_TOKEN` is set
4. Check Telegram Bot API status

---

**Last Updated:** February 6, 2026
**Version:** 1.0.0
