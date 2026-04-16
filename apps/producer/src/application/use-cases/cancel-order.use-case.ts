import type { OrderCancelledEvent } from "@kafka-notify/kafka-types";
import type { IEventPublisher } from "../ports/event-publisher.port";

export interface CancelOrderInput {
  orderId: string;
  userId: string;
  reason: string;
}

export class CancelOrderUseCase {
  constructor(private readonly publisher: IEventPublisher) {}

  async execute(input: CancelOrderInput): Promise<OrderCancelledEvent> {
    const event: OrderCancelledEvent = {
      eventType: "ORDER_CANCELLED",
      orderId: input.orderId,
      userId: input.userId,
      reason: input.reason,
      timestamp: new Date().toISOString(),
    };

    await this.publisher.publish(event);
    console.log(`Published ORDER_CANCELLED for ${input.orderId}`);
    return event;
  }
}
