import { AuthOptions } from 'express-oauth2-jwt-bearer';

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
};
