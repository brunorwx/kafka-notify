import { Kafka, Partitioners, logLevel } from 'kafkajs';
import 'dotenv/config';

export const kafka = new Kafka({
  clientId: 'kafka-notify',
  brokers: [process.env['KAFKA_BROKER'] ?? 'localhost:9092'],
  logLevel: logLevel.ERROR,
});

export function createProducer() {
  return kafka.producer({
    createPartitioner: Partitioners.DefaultPartitioner,
  });
}

export function createConsumer(groupId: string) {
  return kafka.consumer({ groupId });
}
