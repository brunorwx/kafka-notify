import { Component, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgClass, NgFor, DatePipe } from '@angular/common';

interface SentEntry {
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
  imports: [FormsModule, NgClass, NgFor, DatePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private http = inject(HttpClient);

  orderId = signal('ORD-001');
  userId = signal('USR-001');
  totalAmount = signal(99.99);
  currency = signal('USD');
  reason = signal('');
  status = signal('');
  history = signal<SentEntry[]>([]);

  send(type: 'placed' | 'cancelled') {
    const endpoint =
      type === 'placed'
        ? '/api/events/order-placed'
        : '/api/events/order-cancelled';

    const payload = {
      orderId: this.orderId(),
      userId: this.userId(),
      totalAmount: Number(this.totalAmount()),
      currency: this.currency(),
      ...(type === 'cancelled' ? { reason: this.reason() } : {}),
    };

    this.http.post(endpoint, payload).subscribe({
      next: () => {
        const entry: SentEntry = {
          id: crypto.randomUUID(),
          type: type === 'placed' ? 'ORDER_PLACED' : 'ORDER_CANCELLED',
          ...payload,
          timestamp: new Date().toISOString(),
        };
        this.history.update((prev) => [entry, ...prev]);
        this.status.set('Sent!');
        setTimeout(() => this.status.set(''), 2000);
      },
      error: (err) => this.status.set(`Error: ${err.message}`),
    });
  }
}
