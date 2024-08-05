import { Provider } from '@nestjs/common';
import { Redis } from 'ioredis';

import { Configuration } from '@/config/configuration';
import { REDIS_CLIENT } from '@/modules/redis/constants';
import { RedisClient } from '@/modules/redis/types';

export const RedisProvider: Provider = {
    provide: REDIS_CLIENT,
    useFactory: (): RedisClient => {
        return new Redis(Configuration.instance.redis);
    },
};
