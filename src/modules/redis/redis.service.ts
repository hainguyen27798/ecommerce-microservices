import { Inject, Injectable, Logger } from '@nestjs/common';

import { REDIS_CLIENT } from '@/modules/redis/constants';
import { RedisClient } from '@/modules/redis/types';

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
}
