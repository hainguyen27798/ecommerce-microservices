import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9094'],
});

const consumer = kafka.consumer({
    groupId: 'test-group',
});

const run = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ message }) => {
            console.log({
                offset: message.offset,
                value: message.value.toString(),
            });
        },
    });
};

run().catch(console.error);
