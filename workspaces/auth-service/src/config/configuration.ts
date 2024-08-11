import { ENV_MODE } from '@/constants';
import { TConfig } from '@/types';

export class Configuration {
    private static _config: TConfig;

    static init(): TConfig {
        if (!Configuration._config) {
            const envMode = (process.env['NODE_ENV'] as ENV_MODE) || ENV_MODE.DEV;
            Configuration._config = {
                env: envMode,
                port: parseInt(process.env['AUTH_API_PORT'], 10),
                mongo: {
                    host: process.env['AUTH_MONGO_HOST'],
                    port: parseInt(process.env['AUTH_MONGO_PORT'], 10),
                    username: process.env['AUTH_MONGO_USERNAME'],
                    password: process.env['AUTH_MONGO_PASSWORD'],
                    databaseName: process.env['AUTH_MONGO_BD_NAME'],
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
            };
        }
        return Configuration._config;
    }

    static get instance(): TConfig {
        return Configuration._config;
    }
}
