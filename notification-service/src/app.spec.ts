import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Kafka } from 'kafkajs';

import { AppModule } from '@/app.module';
import { Configuration } from '@/config/configuration';

describe('Kafka Connection', () => {
    let app: INestApplication;
    let kafka: Kafka;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();

        kafka = new Kafka({
            clientId: Configuration.instance.notificationBrokerOptions.client.clientId,
            brokers: Configuration.instance.notificationBrokerOptions.client.brokers,
            retry: {
                restartOnFailure: (_e) => new Promise(() => false),
                maxRetryTime: 0,
            },
        });
    });

    it('Should be able to connect to the server', async () => {
        const admin = kafka.admin();

        try {
            await admin.connect();
            expect(true).toBe(true);
        } catch (error) {
            expect(false).toBe(true);
        } finally {
            await admin.disconnect();
        }
    });

    afterAll(async () => {
        await app.close();
    });
});
