import { createConsumer } from "@kafka-notify/kafka-client";
import { TOPIC } from "@kafka-notify/kafka-admin";
import type { OrderEvent } from "@kafka-notify/kafka-types";
import type { IEventListener } from "../../application/ports/event-listener.port";
import type { HandleOrderEventUseCase } from "../../application/use-cases/handle-order-event.use-case";

export class KafkaEventListener implements IEventListener {
  private readonly consumer = createConsumer("notification-group");

  constructor(private readonly handleEvent: HandleOrderEventUseCase) {}

  async connect(): Promise<void> {
    await this.consumer.connect();
    console.log("Consumer connected to Kafka");
  }

  async start(): Promise<void> {
    await this.consumer.subscribe({ topic: TOPIC, fromBeginning: false });

    await this.consumer.run({
      eachMessage: async ({ message, partition }) => {
        const raw = message.value?.toString();
        if (!raw) return;

        try {
          const event = JSON.parse(raw) as OrderEvent;
          this.handleEvent.execute(event, {
            partition,
            offset: message.offset,
          });
        } catch (err) {
          console.error("Failed to parse message:", err);
        }
      },
    });
  }
}
