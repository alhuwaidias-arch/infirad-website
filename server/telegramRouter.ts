/**
 * tRPC Router for Telegram Bridge
 * Handles website chat <-> Telegram communication
 */

import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { forwardToTelegram, messageEvents } from "./telegramBridge";
import { nanoid } from "nanoid";
import { observable } from "@trpc/server/observable";

// In-memory storage for chat sessions
// In production, you'd use a database
const chatSessions = new Map<string, {
  id: string;
  messages: Array<{ text: string; from: "user" | "telegram"; timestamp: string }>;
  userInfo?: { name?: string; email?: string };
}>();

export const telegramRouter = router({
  // Create a new chat session
  createSession: publicProcedure.mutation(() => {
    const sessionId = nanoid();
    chatSessions.set(sessionId, {
      id: sessionId,
      messages: [],
    });
    return { session_id: sessionId };
  }),

  // Send a message from website to Telegram
  sendMessage: publicProcedure
    .input(
      z.object({
        session_id: z.string(),
        message: z.string(),
        user_info: z.object({
          name: z.string().optional(),
          email: z.string().optional(),
        }).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const session = chatSessions.get(input.session_id);
      if (!session) {
        throw new Error("Session not found");
      }

      // Store user info if provided
      if (input.user_info) {
        session.userInfo = input.user_info;
      }

      // Add message to session
      session.messages.push({
        text: input.message,
        from: "user",
        timestamp: new Date().toISOString(),
      });

      // Forward to Telegram
      const success = await forwardToTelegram(
        input.session_id,
        input.message,
        session.userInfo
      );

      if (!success) {
        throw new Error("Failed to forward message to Telegram");
      }

      return {
        success: true,
        message: "Message sent to Telegram",
      };
    }),

  // Subscribe to messages for a session (real-time updates)
  onMessage: publicProcedure
    .input(z.object({ session_id: z.string() }))
    .subscription(({ input }) => {
      return observable<{ text: string; from: string; timestamp: string }>((emit) => {
        const onMessage = (data: any) => {
          emit.next(data);
        };

        // Listen for messages for this session
        messageEvents.on(`message:${input.session_id}`, onMessage);

        // Cleanup
        return () => {
          messageEvents.off(`message:${input.session_id}`, onMessage);
        };
      });
    }),

  // Get chat history for a session
  getHistory: publicProcedure
    .input(z.object({ session_id: z.string() }))
    .query(({ input }) => {
      const session = chatSessions.get(input.session_id);
      if (!session) {
        return { messages: [] };
      }
      return { messages: session.messages };
    }),
});
