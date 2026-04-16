# kafka-notify

Event-driven order notification system built with Kafka, Node.js, and Angular 19.

## Architecture overview

```
EC2 / Cloud Run / ECS
├── producer   (Express API — publishes order events to Kafka)
├── consumer   (Express API + SSE — consumes events, streams to browser)
└── kafka      (MSK on AWS, or self-hosted via docker compose)
```

## Monorepo structure

```
kafka-notify/
├── apps/
│   ├── producer/              ← Express API on :3001
│   │   └── src/
│   │       ├── main.ts                          ← composition root
│   │       ├── application/
│   │       │   ├── ports/
│   │       │   │   └── event-publisher.port.ts  ← IEventPublisher interface
│   │       │   └── use-cases/
│   │       │       ├── place-order.use-case.ts
│   │       │       └── cancel-order.use-case.ts
│   │       ├── infrastructure/
│   │       │   └── messaging/
│   │       │       └── kafka-event-publisher.ts ← Kafka implementation
│   │       └── presentation/
│   │           ├── server.ts
│   │           └── routes/
│   │               └── order.router.ts
│   │
│   ├── producer-ui/           ← Angular 19 UI on :4200
│   │
│   ├── consumer/              ← Express API + SSE on :3002
│   │   └── src/
│   │       ├── main.ts                               ← composition root
│   │       ├── application/
│   │       │   ├── ports/
│   │       │   │   ├── event-broadcaster.port.ts     ← IEventBroadcaster interface
│   │       │   │   └── event-listener.port.ts        ← IEventListener interface
│   │       │   └── use-cases/
│   │       │       └── handle-order-event.use-case.ts
│   │       ├── infrastructure/
│   │       │   └── messaging/
│   │       │       └── kafka-event-listener.ts       ← Kafka implementation
│   │       └── presentation/
│   │           ├── server.ts
│   │           ├── sse/
│   │           │   └── sse-manager.ts                ← SSE client registry
│   │           └── routes/
│   │               └── events.router.ts
│   │
│   └── consumer-ui/           ← Angular 19 UI on :4201
│
└── libs/
    ├── kafka-types/     ← @kafka-notify/kafka-types  (shared event interfaces)
    ├── kafka-client/    ← @kafka-notify/kafka-client (Kafka producer/consumer factory)
    └── kafka-admin/     ← @kafka-notify/kafka-admin  (topic management CLI)
```

## Backend clean architecture

Both backend services follow the same layering:

| Layer | Responsibility | Dependencies |
|---|---|---|
| `application/ports` | Interfaces (contracts) | none |
| `application/use-cases` | Business logic | ports only |
| `infrastructure` | Kafka implementations | implements ports |
| `presentation` | Express routes, SSE | use-cases, ports |
| `main.ts` | Composition root — wires everything | all layers |

The use cases depend only on interfaces — swapping Kafka for another broker requires changes only in `infrastructure/`.

## How to run

```
# Terminal 1 — install deps and start Kafka
npm i
docker compose up -d

# Create the order-events topic (once)
npm run admin

# Terminal 2 — producer backend
nx serve producer          # http://localhost:3001

# Terminal 3 — producer UI
nx serve producer-ui       # http://localhost:4200

# Terminal 4 — consumer backend
nx serve consumer          # http://localhost:3002

# Terminal 5 — consumer UI
nx serve consumer-ui       # http://localhost:4201
```

## How the UIs work

Both UIs are built with Angular 19 using standalone components, signals for state management, and zoneless change detection (no zone.js).

**Producer UI (4200)** — fill in Order ID / User ID and click "Place Order" or "Cancel Order". Each click POSTs to the Express backend which publishes to Kafka. The sent-event history updates reactively via Angular signals.

**Consumer UI (4201)** — opens a persistent SSE connection to the consumer backend. Every time a message arrives in Kafka the backend receives it via `consumer.run()` and broadcasts it to all connected browser tabs in real time. Events are colour-coded (green = placed, red = cancelled) with a running counter. Connection status (connecting / connected / disconnected) is tracked as a signal with a reconnect button.

## Docker (optional)

Kafka must already be running via `docker compose up -d` before starting the app stacks.

```bash
# Producer stack (backend :3001 + UI :4200)
cd apps/producer && docker compose up

# Consumer stack (backend :3002 + UI :4201)
cd apps/consumer && docker compose up
```

## Environment variables

| Variable | Service | Default | Purpose |
|---|---|---|---|
| `PRODUCER_PORT` | producer | `3001` | HTTP port |
| `CONSUMER_PORT` | consumer | `3002` | HTTP port |
| `KAFKA_BROKER` | both | `localhost:9092` | Kafka broker address |
