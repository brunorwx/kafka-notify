import type { OrderEvent } from "@kafka-notify/kafka-types";

export interface IEventBroadcaster {
  broadcast(event: OrderEvent): void;
  clientCount(): number;
}
