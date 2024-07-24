import { producer } from '../config/kafka.js';

export async function sendMessage(topic, message) {
  await producer.send({
    topic,
    messages: [
      { value: message },
    ],
  });

  console.log(`Message sent to topic ${topic}: ${message}`);
}
