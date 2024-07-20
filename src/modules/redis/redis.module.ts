import { Global, Module } from '@nestjs/common';

import { RedisProvider } from '@/modules/redis/redis.provider';
import { RedisService } from '@/modules/redis/redis.service';

@Global()
@Module({
    providers: [RedisProvider, RedisService],
    exports: [RedisService],
})
export class RedisModule {}
