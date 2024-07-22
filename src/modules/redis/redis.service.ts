import { Inject, Injectable, Logger } from '@nestjs/common';

import { REDIS_CLIENT } from '@/modules/redis/constants';
import { RedisClient } from '@/modules/redis/types';

const RETRY_TIMEOUT = 100;
const EXPIRE_TIMEOUT = 3000;

@Injectable()
export class RedisService {
    constructor(
        @Inject(REDIS_CLIENT)
        private readonly _RedisClient: RedisClient,
    ) {
        _RedisClient.ping((err, result) => {
            if (err) {
                Logger.error(err.message);
            } else {
                Logger.log(`Redis: ${result}`);
            }
        });
    }

    async acquireLock<T = unknown>(key: string, callBack: () => Promise<T>): Promise<{ key: string; value: T } | null> {
        for (let i = 0; i < 3; i++) {
            // add lock
            const result = await this._RedisClient.setnx(key, EXPIRE_TIMEOUT);
            if (result !== 0) {
                // execute main login
                const result = await callBack();
                return { key, value: result };
            }

            // retry
            await new Promise((resolve) => setTimeout(resolve, RETRY_TIMEOUT));
        }
        return null;
    }

    async release(...keys: string[]) {
        return this._RedisClient.del(...keys);
    }
}
