import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule } from '@nestjs/microservices';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';

import { NotificationServiceConfig } from '@/config';
import { MicroserviceName } from '@/constants';
import { handler } from '@/modules/product/commands';
import { Product, ProductSchema } from '@/modules/product/schemas/product.schema';
import {
    PRODUCT_DETAIL_MODELS,
    ProductDetailModelRegistry,
} from '@/modules/product/schemas/product-details-model-registry';

import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductDetailsService } from './product-details.service';

@Module({
    providers: [
        ProductService,
        {
            provide: PRODUCT_DETAIL_MODELS,
            useFactory: ProductDetailModelRegistry,
            inject: [getConnectionToken()],
        },
        ProductDetailsService,
        ...handler,
    ],
    controllers: [ProductController],
    imports: [
        MongooseModule.forFeature([
            {
                name: Product.name,
                schema: ProductSchema,
            },
        ]),
        CqrsModule,
        ClientsModule.registerAsync([
            {
                imports: [ConfigModule],
                name: MicroserviceName.NOTIFICATION_MICROSERVICE,
                useClass: NotificationServiceConfig,
            },
        ]),
    ],
})
export class ProductModule {}
