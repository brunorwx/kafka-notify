import "dotenv/config";
import { KafkaEventPublisher } from "./infrastructure/messaging/kafka-event-publisher";
import { PlaceOrderUseCase } from "./application/use-cases/place-order.use-case";
import { CancelOrderUseCase } from "./application/use-cases/cancel-order.use-case";
import { createServer } from "./presentation/server";

async function bootstrap(): Promise<void> {
  const publisher = new KafkaEventPublisher();
  await publisher.connect();

  const placeOrder = new PlaceOrderUseCase(publisher);
  const cancelOrder = new CancelOrderUseCase(publisher);

  const app = createServer(placeOrder, cancelOrder);

  const port = process.env["PRODUCER_PORT"] ?? 3001;
  app.listen(port, () => {
    console.log(`Producer API running on http://localhost:${port}`);
  });
}

bootstrap().catch(console.error);
