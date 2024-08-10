import { type FirebaseOptions } from '@firebase/app';

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
    firebase: FirebaseOptions;
};
