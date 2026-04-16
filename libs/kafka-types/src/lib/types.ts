export interface OrderPlacedEvent {
  eventType: 'ORDER_PLACED';
  orderId: string;
  userId: string;
  totalAmount: number;
  currency: string;
  timestamp: string;
}

export interface OrderCancelledEvent {
  eventType: 'ORDER_CANCELLED';
  orderId: string;
  userId: string;
  reason: string;
  timestamp: string;
}

export type OrderEvent = OrderPlacedEvent | OrderCancelledEvent;
