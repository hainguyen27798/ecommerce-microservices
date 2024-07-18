import { Module } from '@nestjs/common';

import { RedisProvider } from '@/modules/redis/redis.provider';
import { RedisService } from '@/modules/redis/redis.service';

@Module({
    providers: [RedisProvider, RedisService],
    exports: [RedisService],
})
export class RedisModule {}
