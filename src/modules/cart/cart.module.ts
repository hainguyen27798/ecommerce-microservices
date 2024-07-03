import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Cart, CartProductSchema } from '@/modules/cart/schemas/cart.schema';

import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
    controllers: [CartController],
    imports: [
        MongooseModule.forFeature([
            {
                name: Cart.name,
                schema: CartProductSchema,
            },
        ]),
    ],
    providers: [CartService],
})
export class CartModule {}
