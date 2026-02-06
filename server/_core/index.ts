import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import path from "path";
import { fileURLToPath } from "url";
import { spawn, ChildProcess } from "child_process";
import { createProxyMiddleware } from "http-proxy-middleware";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { initTelegramBridge } from "../telegramBridge";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let pythonProcess: ChildProcess | null = null;

function startHadiAPI() {
  const hadiPath = path.resolve(__dirname, "..", "..", "hadi-api");

  pythonProcess = spawn("python3", ["-m", "uvicorn", "web_api:app", "--host", "127.0.0.1", "--port", "8000"], {
    cwd: hadiPath,
    stdio: "inherit",
    env: { ...process.env },
  });

  pythonProcess.on("error", (err) => {
    console.error("[Hadi] Failed to start Hadi API:", err);
  });

  pythonProcess.on("exit", (code) => {
    if (code !== null && code !== 0) {
      console.error(`[Hadi] Process exited with code ${code}`);
    }
  });

  console.log("🤖 [Hadi] AI agent starting on port 8000...");
}

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Start Hadi Python API subprocess
  if (process.env.NODE_ENV !== "test") {
    startHadiAPI();
  }

  // Initialize Telegram Bridge
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
  if (telegramToken) {
    initTelegramBridge(telegramToken);
  } else {
    console.warn("⚠️  [Telegram Bridge] TELEGRAM_BOT_TOKEN not found. Telegram bridge disabled.");
  }
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // Proxy Hadi API requests
  app.use(
    "/api/hadi",
    createProxyMiddleware({
      target: "http://127.0.0.1:8000",
      changeOrigin: true,
      pathRewrite: {
        "^/api/hadi": "", // Remove /api/hadi prefix
      },
    })
  );

  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}/`);
    console.log(`📡 Hadi API proxied at http://localhost:${port}/api/hadi`);
  });

  // Cleanup on exit
  process.on("SIGINT", () => {
    console.log("\n🛑 Shutting down...");
    if (pythonProcess) {
      pythonProcess.kill();
    }
    process.exit();
  });

  process.on("SIGTERM", () => {
    if (pythonProcess) {
      pythonProcess.kill();
    }
    process.exit();
  });
}

startServer().catch(console.error);
