import { Module } from '@nestjs/common';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';

import { Product, ProductSchema } from '@/modules/product/schemas/product.schema';
import { PRODUCT_MODELS, ProductModelRegistry } from '@/modules/product/schemas/product-model-registry';

import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
    providers: [
        ProductService,
        {
            provide: PRODUCT_MODELS,
            useFactory: ProductModelRegistry,
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
