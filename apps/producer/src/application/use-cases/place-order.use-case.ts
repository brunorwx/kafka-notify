import type { OrderPlacedEvent } from "@kafka-notify/kafka-types";
import type { IEventPublisher } from "../ports/event-publisher.port";

export interface PlaceOrderInput {
  orderId: string;
  userId: string;
  totalAmount: number;
  currency: string;
}

export class PlaceOrderUseCase {
  constructor(private readonly publisher: IEventPublisher) {}

  async execute(input: PlaceOrderInput): Promise<OrderPlacedEvent> {
    const event: OrderPlacedEvent = {
      eventType: "ORDER_PLACED",
      orderId: input.orderId,
      userId: input.userId,
      totalAmount: Number(input.totalAmount),
      currency: input.currency,
      timestamp: new Date().toISOString(),
    };

    await this.publisher.publish(event);
    console.log(`Published ORDER_PLACED for ${input.orderId}`);
    return event;
  }
}
