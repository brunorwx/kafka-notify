import "dotenv/config";
import { SseManager } from "./presentation/sse/sse-manager";
import { HandleOrderEventUseCase } from "./application/use-cases/handle-order-event.use-case";
import { KafkaEventListener } from "./infrastructure/messaging/kafka-event-listener";
import { createServer } from "./presentation/server";

async function bootstrap(): Promise<void> {
  const sseManager = new SseManager();
  const handleEvent = new HandleOrderEventUseCase(sseManager);
  const listener = new KafkaEventListener(handleEvent);

  await listener.connect();
  await listener.start();

  const app = createServer(sseManager);

  const port = process.env["CONSUMER_PORT"] ?? 3002;
  app.listen(port, () => {
    console.log(`Consumer API running on http://localhost:${port}`);
  });
}

bootstrap().catch(console.error);
