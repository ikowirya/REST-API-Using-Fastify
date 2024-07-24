import { Kafka } from 'kafkajs';

// Load environment variables
const kafkaBrokers = process.env.KAFKA_BROKERS.split(',');
const kafkaClientId = process.env.KAFKA_CLIENT_ID || 'my-app';
const kafkaGroupId = process.env.KAFKA_GROUP_ID || 'my-group';

const kafka = new Kafka({
  clientId: kafkaClientId,
  brokers: kafkaBrokers,
  ssl: process.env.KAFKA_SSL === 'true',
  sasl: process.env.KAFKA_USERNAME && process.env.KAFKA_PASSWORD ? {
    mechanism: process.env.KAFKA_MECHANISM || 'plain', // scram-sha-256 or scram-sha-512
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD,
  } : undefined,
});

export const consumer = kafka.consumer({ groupId: kafkaGroupId });
export const producer = kafka.producer();

export async function connectKafka() {
  await Promise.all([
    consumer.connect(),
    producer.connect(),
  ]);
  console.log('Kafka connected');
}

export async function disconnectKafka() {
  await Promise.all([
    consumer.disconnect(),
    producer.disconnect(),
  ]);
  console.log('Kafka disconnected');
}
