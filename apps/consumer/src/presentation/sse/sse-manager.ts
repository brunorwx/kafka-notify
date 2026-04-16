import type { Response } from 'express';
import type { OrderEvent } from '@kafka-notify/kafka-types';
import type { IEventBroadcaster } from '../../application/ports/event-broadcaster.port';

export class SseManager implements IEventBroadcaster {
  private readonly clients = new Set<Response>();

  add(res: Response): void {
    this.clients.add(res);
    console.log(`SSE client connected (total: ${this.clients.size})`);
  }

  remove(res: Response): void {
    this.clients.delete(res);
    console.log(`SSE client disconnected (total: ${this.clients.size})`);
  }

  broadcast(event: OrderEvent): void {
    const payload = `data: ${JSON.stringify(event)}\n\n`;
    this.clients.forEach((client) => client.write(payload));
  }

  clientCount(): number {
    return this.clients.size;
  }
}
