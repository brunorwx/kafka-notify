import express, { type Express } from "express";
import cors from "cors";
import type { SseManager } from "./sse/sse-manager";
import { createEventsRouter } from "./routes/events.router";

export function createServer(sseManager: SseManager): Express {
  const app = express();
  app.use(cors());
  app.use("/api", createEventsRouter(sseManager));
  return app;
}
