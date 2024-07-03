import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { Configuration } from '@/config/configuration';
import { DatabaseModule } from '@/database/database.module';
import { ApiKeyModule } from '@/modules/api-key/api-key.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { DiscountModule } from '@/modules/discount/discount.module';
import { InventoryModule } from '@/modules/inventory/inventory.module';
import { ProductModule } from '@/modules/product/product.module';
import { TokenModule } from '@/modules/token/token.module';
import { UserModule } from '@/modules/user/user.module';

import { RedisModule } from './modules/redis/redis.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.env.${process.env.NODE_ENV}`,
            isGlobal: true,
            load: [Configuration.init],
        }),
        RedisModule,
        DatabaseModule,
        UserModule,
        TokenModule,
        AuthModule,
        ApiKeyModule,
        ProductModule,
        InventoryModule,
        DiscountModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
