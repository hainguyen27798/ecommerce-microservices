import { KafkaOptions } from '@nestjs/microservices';
import { AuthOptions } from 'express-oauth2-jwt-bearer';
import { RedisOptions } from 'ioredis';

import { ENV_MODE } from '@/constants';

export type TConfig = {
    env: ENV_MODE;
    port: number;
    mongo: {
        port: number;
        host: string;
        username: string;
        password: string;
        databaseName: string;
        authSource: string;
    };
    superuser: {
        email: string;
        pass: string;
    };
    auth0Config: AuthOptions;
    redis: RedisOptions;
    notificationBrokerOptions: KafkaOptions['options'];
};
