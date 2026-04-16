import { kafka } from '@kafka-notify/kafka-client';

export const TOPIC = 'order-events';

export async function createTopics(): Promise<void> {
  const admin = kafka.admin();

  await admin.connect();
  console.log('Admin connected');

  const existing = await admin.listTopics();

  if (existing.includes(TOPIC)) {
    console.log(`Topic '${TOPIC}' already exists`);
  } else {
    await admin.createTopics({
      topics: [
        {
          topic: TOPIC,
          numPartitions: 3,
          replicationFactor: 1,
          configEntries: [
            { name: 'retention.ms', value: '604800000' },
          ],
        },
      ],
      waitForLeaders: true,
    });
    console.log(`Topic '${TOPIC}' created`);
  }

  await admin.disconnect();
}
