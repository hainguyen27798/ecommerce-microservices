import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';

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
    ],
})
export class ProductModule {}
