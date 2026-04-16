import express, { type Express } from "express";
import cors from "cors";
import type { PlaceOrderUseCase } from "../application/use-cases/place-order.use-case";
import type { CancelOrderUseCase } from "../application/use-cases/cancel-order.use-case";
import { createOrderRouter } from "./routes/order.router";

export function createServer(
  placeOrder: PlaceOrderUseCase,
  cancelOrder: CancelOrderUseCase,
): Express {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "producer" });
  });

  app.use("/api/events", createOrderRouter(placeOrder, cancelOrder));

  return app;
}
