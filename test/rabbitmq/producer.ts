import amqp from 'amqplib';

const run = async () => {
    try {
        const connection = await amqp.connect('amqp://admin:*****@localhost');
        const channel = await connection.createChannel();

        const queueName = 'test-topic';
        await channel.assertQueue(queueName, {
            durable: true,
        });

        channel.sendToQueue(queueName, Buffer.from('Hello RabbitMQ user!'));

        await channel.close();
        await connection.close();
    } catch (err) {
        console.error(err.message);
    }
};

run().catch(console.error);
