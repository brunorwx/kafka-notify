import type { OrderEvent } from "@kafka-notify/kafka-types";
import type { IEventBroadcaster } from "../ports/event-broadcaster.port";

export interface EventMeta {
  partition: number;
  offset: string;
}

export class HandleOrderEventUseCase {
  constructor(private readonly broadcaster: IEventBroadcaster) {}

  execute(event: OrderEvent, meta: EventMeta): void {
    console.log(
      `[partition ${meta.partition} | offset ${meta.offset}] ${event.eventType} — ${event.orderId}`,
    );
    this.broadcaster.broadcast(event);
  }
}
