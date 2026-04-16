import { Component, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { NgClass, DatePipe } from '@angular/common';

interface OrderEvent {
  id: string;
  type: 'ORDER_PLACED' | 'ORDER_CANCELLED';
  orderId: string;
  userId: string;
  totalAmount: number;
  currency: string;
  reason?: string;
  timestamp: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgClass, DatePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  private eventSource: EventSource | null = null;

  connectionStatus = signal<'connecting' | 'connected' | 'disconnected'>('connecting');
  events = signal<OrderEvent[]>([]);

  placedCount = computed(() => this.events().filter((e) => e.type === 'ORDER_PLACED').length);
  cancelledCount = computed(() => this.events().filter((e) => e.type === 'ORDER_CANCELLED').length);

  ngOnInit() {
    this.connect();
  }

  connect() {
    this.connectionStatus.set('connecting');
    this.eventSource = new EventSource('/api/events');

    this.eventSource.onopen = () => this.connectionStatus.set('connected');

    this.eventSource.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data) as Omit<OrderEvent, 'id'>;
      this.events.update((prev) =>
        [{ ...data, id: crypto.randomUUID() }, ...prev].slice(0, 100)
      );
    };

    this.eventSource.onerror = () => {
      this.connectionStatus.set('disconnected');
      this.eventSource?.close();
      this.eventSource = null;
    };
  }

  disconnect() {
    this.eventSource?.close();
    this.eventSource = null;
    this.connectionStatus.set('disconnected');
  }

  ngOnDestroy() {
    this.eventSource?.close();
  }
}
