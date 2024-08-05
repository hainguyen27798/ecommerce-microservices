import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';

import { handler } from '@/modules/cart/commands';
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
        CqrsModule,
    ],
    providers: [CartService, ...handler],
})
export class CartModule {}
