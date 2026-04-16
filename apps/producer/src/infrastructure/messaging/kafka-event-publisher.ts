import { createProducer } from "@kafka-notify/kafka-client";
import { TOPIC } from "@kafka-notify/kafka-admin";
import type {
  OrderCancelledEvent,
  OrderPlacedEvent,
} from "@kafka-notify/kafka-types";
import type { IEventPublisher } from "../../application/ports/event-publisher.port";

export class KafkaEventPublisher implements IEventPublisher {
  private readonly producer = createProducer();

  async connect(): Promise<void> {
    await this.producer.connect();
    console.log("Producer connected to Kafka");
  }

  async publish(event: OrderPlacedEvent | OrderCancelledEvent): Promise<void> {
    await this.producer.send({
      topic: TOPIC,
      messages: [{ key: event.orderId, value: JSON.stringify(event) }],
    });
  }

  async disconnect(): Promise<void> {
    await this.producer.disconnect();
  }
}
