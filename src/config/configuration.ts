import { ENV_MODE } from '@/constants';
import { TConfig } from '@/types';

export class Configuration {
    private static _config: TConfig;

    static init(): TConfig {
        if (!Configuration._config) {
            const envMode = (process.env['NODE_ENV'] as ENV_MODE) || ENV_MODE.DEV;
            Configuration._config = {
                env: envMode,
                port: parseInt(process.env['API_PORT'], 10),
                mongo: {
                    host: process.env['MONGO_HOST'],
                    port: parseInt(process.env['MONGO_PORT'], 10),
                    username: process.env['MONGO_USERNAME'],
                    password: process.env['MONGO_PASSWORD'],
                    databaseName: process.env['MONGO_BD_NAME'],
                    authSource: 'admin',
                },
                superuser: {
                    email: process.env[`SUPERUSER_EMAIL`],
                    pass: process.env[`SUPERUSER_PASS`],
                },
                auth0Config: {
                    issuerBaseURL: process.env['AUTH0_ISSUER_BASE_URL'],
                    audience: process.env['AUTH0_AUDIENCE'],
                },
                redis: {
                    host: process.env['REDIS_HOST'],
                    port: parseInt(process.env['REDIS_PORT'], 10),
                    password: process.env['REDIS_PASSWORD'],
                },
                firebase: {
                    apiKey: process.env['FIREBASE_API_KEY'],
                    authDomain: process.env['FIREBASE_AUTH_DOMAIN'],
                    projectId: process.env['FIREBASE_PROJECT_ID'],
                    storageBucket: process.env['FIREBASE_STORAGE_BUCKET'],
                    messagingSenderId: process.env['FIREBASE_MESSAGING_SENDER_ID'],
                    appId: process.env['FIREBASE_APP_ID'],
                    measurementId: process.env['FIREBASE_MEASUREMENT_ID'],
                },
            };
        }
        return Configuration._config;
    }

    static get instance(): TConfig {
        return Configuration._config;
    }
}
