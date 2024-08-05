import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { Configuration } from '@/config/configuration';
import { DatabaseModule } from '@/database/database.module';
import { ApiKeyModule } from '@/modules/api-key/api-key.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { CartModule } from '@/modules/cart/cart.module';
import { CheckoutModule } from '@/modules/checkout/checkout.module';
import { CommentModule } from '@/modules/comment/comment.module';
import { DiscountModule } from '@/modules/discount/discount.module';
import { InventoryModule } from '@/modules/inventory/inventory.module';
import { NotificationModule } from '@/modules/notification/notification.module';
import { OrderModule } from '@/modules/order/order.module';
import { ProductModule } from '@/modules/product/product.module';
import { RedisModule } from '@/modules/redis/redis.module';
import { TokenModule } from '@/modules/token/token.module';
import { UserModule } from '@/modules/user/user.module';

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
        CartModule,
        CheckoutModule,
        OrderModule,
        CommentModule,
        NotificationModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
