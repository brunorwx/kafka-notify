import { Router } from "express";
import type { SseManager } from "../sse/sse-manager";

export function createEventsRouter(sseManager: SseManager): Router {
  const router = Router();

  router.get("/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "consumer",
      clients: sseManager.clientCount(),
    });
  });

  router.get("/events", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const keepAlive = setInterval(() => res.write(": keep-alive\n\n"), 30_000);
    sseManager.add(res);

    req.on("close", () => {
      clearInterval(keepAlive);
      sseManager.remove(res);
    });
  });

  return router;
}
