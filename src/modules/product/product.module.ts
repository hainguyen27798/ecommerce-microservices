import { Module } from '@nestjs/common';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';

import { Product, ProductSchema } from '@/modules/product/schemas/product.schema';
import {
    PRODUCT_DETAIL_MODELS,
    ProductDetailModelRegistry,
} from '@/modules/product/schemas/product-details-model-registry';

import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
    providers: [
        ProductService,
        {
            provide: PRODUCT_DETAIL_MODELS,
            useFactory: ProductDetailModelRegistry,
            inject: [getConnectionToken()],
        },
    ],
    controllers: [ProductController],
    imports: [
        MongooseModule.forFeature([
            {
                name: Product.name,
                schema: ProductSchema,
            },
        ]),
    ],
})
export class ProductModule {}
