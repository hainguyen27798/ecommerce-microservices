import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { Configuration } from '@/config/configuration';
import { DatabaseModule } from '@/database/database.module';
import { ApiKeyModule } from '@/modules/api-key/api-key.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { ProductModule } from '@/modules/product/product.module';
import { TokenModule } from '@/modules/token/token.module';
import { UserModule } from '@/modules/user/user.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.env.${process.env.NODE_ENV}`,
            isGlobal: true,
            load: [Configuration.init],
        }),
        DatabaseModule,
        UserModule,
        TokenModule,
        AuthModule,
        ApiKeyModule,
        ProductModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
