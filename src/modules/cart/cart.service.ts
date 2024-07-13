import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SuccessDto } from '@/dto/core';
import { CartState } from '@/modules/cart/constants';
import { CartDto, CartProductDto } from '@/modules/cart/dto';
import { Cart } from '@/modules/cart/schemas/cart.schema';

@Injectable()
export class CartService {
    constructor(@InjectModel(Cart.name) private readonly _CartModel: Model<Cart>) {}

    async addToCart(userId: string, cartProducts: CartProductDto[]) {
        const userCart = await this._CartModel.findOne({
            user: userId,
        });

        if (!userCart) {
            const newCart = await this.createCart(userId, cartProducts);
            return new SuccessDto('Created new cart', HttpStatus.CREATED, newCart, CartDto);
        }

        await Promise.all(cartProducts.map(async (cartProduct) => this.updateProductCart(userId, cartProduct)));

        return new SuccessDto('Add to cart successfully');
    }

    private async createCart(userId: string, cartProducts: CartProductDto[]) {
        return this._CartModel.create({
            user: userId,
            state: CartState.ACTIVE,
            cartProducts,
        });
    }

    private async updateProductCart(userId: string, cartProduct: CartProductDto) {
        const result = await this._CartModel.findOneAndUpdate(
            {
                user: userId,
                state: CartState.ACTIVE,
                'cartProducts.product': cartProduct.product,
            },
            {
                $inc: {
                    'cartProducts.$.quantity': cartProduct.quantity,
                },
            },
            { new: true },
        );

        if (!result) {
            await this._CartModel.findOneAndUpdate(
                {
                    user: userId,
                    state: CartState.ACTIVE,
                },
                {
                    $push: {
                        cartProducts: cartProduct,
                    },
                },
            );
        }
    }
}
