import { Router } from "express";
import type { PlaceOrderUseCase } from "../../application/use-cases/place-order.use-case";
import type { CancelOrderUseCase } from "../../application/use-cases/cancel-order.use-case";

export function createOrderRouter(
  placeOrder: PlaceOrderUseCase,
  cancelOrder: CancelOrderUseCase,
): Router {
  const router = Router();

  router.post("/order-placed", async (req, res) => {
    const {
      orderId,
      userId,
      totalAmount,
      currency = "USD",
    } = req.body as {
      orderId: string;
      userId: string;
      totalAmount: number;
      currency?: string;
    };

    const event = await placeOrder.execute({
      orderId,
      userId,
      totalAmount,
      currency,
    });
    res.json({ success: true, event });
  });

  router.post("/order-cancelled", async (req, res) => {
    const { orderId, userId, reason } = req.body as {
      orderId: string;
      userId: string;
      reason: string;
    };

    const event = await cancelOrder.execute({ orderId, userId, reason });
    res.json({ success: true, event });
  });

  return router;
}
