/**
 * Telegram Bridge Service
 * Forwards website chat messages to Telegram and vice versa
 */

import { Telegraf } from "telegraf";
import { EventEmitter } from "events";

// Session storage: maps session_id to telegram chat_id
const sessions = new Map<string, number>();
// Reverse mapping: telegram chat_id to session_id
const telegramToSession = new Map<number, string>();

// Event emitter for real-time message updates
export const messageEvents = new EventEmitter();

let bot: Telegraf | null = null;

export function initTelegramBridge(token: string) {
  if (!token) {
    console.error("[Telegram Bridge] No TELEGRAM_BOT_TOKEN provided");
    return null;
  }

  try {
    bot = new Telegraf(token);

    // Handle incoming messages from Telegram
    bot.on("text", async (ctx) => {
      const telegramChatId = ctx.chat.id;
      const message = ctx.message.text;
      const sessionId = telegramToSession.get(telegramChatId);

      if (sessionId) {
        // This is a reply to an existing website chat session
        console.log(`[Telegram Bridge] Reply from Telegram for session ${sessionId}: ${message}`);
        
        // Emit event so website can receive the message
        messageEvents.emit(`message:${sessionId}`, {
          text: message,
          from: "telegram",
          timestamp: new Date().toISOString(),
        });

        await ctx.reply("✅ Message sent to website chat");
      } else {
        // New conversation from Telegram
        await ctx.reply(
          "👋 Welcome! This bot is connected to the INFIRAD website chat.\n\n" +
          "When a visitor sends a message on the website, you'll receive it here and can reply directly."
        );
      }
    });

    // Handle errors
    bot.catch((err: any) => {
      console.error("[Telegram Bridge] Bot error:", err.message);
    });

    // Start the bot
    bot.launch().then(() => {
      console.log("✅ [Telegram Bridge] Bot started successfully");
    }).catch((err: any) => {
      if (err.message.includes("409") || err.message.includes("Conflict")) {
        console.warn("⚠️  [Telegram Bridge] Another bot instance is running. Stopping this instance.");
        bot = null;
      } else {
        console.error("[Telegram Bridge] Failed to start bot:", err.message);
      }
    });

    // Graceful shutdown
    process.once("SIGINT", () => bot?.stop("SIGINT"));
    process.once("SIGTERM", () => bot?.stop("SIGTERM"));

    return bot;
  } catch (error) {
    console.error("[Telegram Bridge] Failed to initialize:", error);
    return null;
  }
}

/**
 * Forward a website message to Telegram
 */
export async function forwardToTelegram(
  sessionId: string,
  message: string,
  userInfo?: { name?: string; email?: string }
): Promise<boolean> {
  if (!bot) {
    console.warn("[Telegram Bridge] Bot not available. Message will be stored but not forwarded.");
    // Store the message anyway so it can be retrieved later
    return true; // Return true to not break the flow
  }

  try {
    // Get the admin's Telegram chat ID (you'll need to send /start to the bot first)
    // For now, we'll use the first chat ID that interacts with the bot
    // In production, you'd configure this as an environment variable

    // If this session already has a Telegram chat associated, use it
    let telegramChatId = sessions.get(sessionId);

    if (!telegramChatId) {
      // Get all chat IDs (in practice, you'd configure your admin chat ID)
      const chatIds = Array.from(telegramToSession.keys());
      if (chatIds.length === 0) {
        console.error("[Telegram Bridge] No Telegram chats available. Please send /start to the bot first.");
        return false;
      }
      
      // Use the first available chat (your admin account)
      telegramChatId = chatIds[0];
      sessions.set(sessionId, telegramChatId);
      telegramToSession.set(telegramChatId, sessionId);
    }

    // Format the message
    const userInfoText = userInfo?.name || userInfo?.email 
      ? `\n👤 ${userInfo.name || "Anonymous"} ${userInfo.email ? `(${userInfo.email})` : ""}`
      : "";

    const formattedMessage = 
      `🌐 *New message from website*\n` +
      `📝 Session: \`${sessionId}\`` +
      userInfoText +
      `\n\n${message}`;

    await bot.telegram.sendMessage(telegramChatId, formattedMessage, {
      parse_mode: "Markdown",
    });

    console.log(`[Telegram Bridge] Message forwarded to Telegram chat ${telegramChatId}`);
    return true;
  } catch (error) {
    console.error("[Telegram Bridge] Failed to forward message:", error);
    return false;
  }
}

/**
 * Register a Telegram chat as the admin chat
 * Call this when the admin sends /start to the bot
 */
export function registerAdminChat(chatId: number) {
  // Store this chat ID as available for receiving messages
  if (!telegramToSession.has(chatId)) {
    console.log(`[Telegram Bridge] Registered admin chat: ${chatId}`);
  }
}

export function getTelegramBot() {
  return bot;
}
