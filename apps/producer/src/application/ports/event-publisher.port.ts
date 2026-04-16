import type {
  OrderCancelledEvent,
  OrderPlacedEvent,
} from "@kafka-notify/kafka-types";

export interface IEventPublisher {
  connect(): Promise<void>;
  publish(event: OrderPlacedEvent | OrderCancelledEvent): Promise<void>;
  disconnect(): Promise<void>;
}
