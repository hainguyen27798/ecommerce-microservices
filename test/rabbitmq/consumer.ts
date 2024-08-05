import amqp from 'amqplib';

const run = async () => {
    try {
        const connection = await amqp.connect('amqp://admin:*****@localhost');
        const channel = await connection.createChannel();

        const queueName = 'test-topic';
        await channel.assertQueue(queueName, {
            durable: true,
        });

        await channel.consume(
            queueName,
            (msg) => {
                console.log(msg.content.toString());
            },
            {
                noAck: true,
            },
        );
    } catch (err) {
        console.error(err.message);
    }
};

run().catch(console.error);
