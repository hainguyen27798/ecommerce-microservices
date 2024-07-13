import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { every } from 'lodash';
import { Model } from 'mongoose';

import { SuccessDto } from '@/dto/core';
import { CartState } from '@/modules/cart/constants';
import { CartProductDto, ProductCartDto } from '@/modules/cart/dto';
import { Cart, CartDocument } from '@/modules/cart/schemas/cart.schema';
import { CheckSpecificProductsCommand } from '@/modules/product/commands';
import { TObjectId } from '@/types';

@Injectable()
export class CartService {
    constructor(
        @InjectModel(Cart.name) private readonly _CartModel: Model<Cart>,
        private readonly _CommandBus: CommandBus,
    ) {}

    async getCartById(cartId: string): Promise<CartDocument> {
        return this._CartModel.findById(cartId);
    }

    async getProductCarts(userId: string) {
        const cart = await this._CartModel
            .findOne({
                user: userId,
            })
            .populate('cartProducts.product')
            .exec();
        return new SuccessDto(null, HttpStatus.OK, cart.cartProducts, ProductCartDto);
    }

    async addToCart(userId: string, cartProducts: CartProductDto[]) {
        const valid = await Promise.allSettled(
            cartProducts.map((cartProduct) =>
                this._CommandBus.execute(
                    new CheckSpecificProductsCommand(cartProduct.shop, [cartProduct.product], false),
                ),
            ),
        ).then((results) => every(results, (result) => result['value']));

        if (!valid) {
            throw new BadRequestException('Bad cart');
        }

        const userCart = await this._CartModel.findOne({
            user: userId,
        });

        if (!userCart) {
            await this.createCart(userId, cartProducts);
            return new SuccessDto('Created new cart', HttpStatus.CREATED);
        }

        await Promise.allSettled(cartProducts.map((cartProduct) => this.updateProductCart(userId, cartProduct)));
        return new SuccessDto('Update cart', HttpStatus.OK);
    }

    private async createCart(userId: string, cartProducts: CartProductDto[]) {
        return this._CartModel.create({
            user: userId,
            state: CartState.ACTIVE,
            cartProducts,
        });
    }

    async deleteProductInCart(userId: string, productId: TObjectId) {
        const cart = await this._CartModel.findOneAndUpdate(
            {
                user: userId,
                'cartProducts.product': productId,
            },
            {
                $pull: { cartProducts: { product: productId } },
            },
        );

        if (!cart) {
            throw new BadRequestException('Product invalid');
        }

        return new SuccessDto('Deleted product in cart', HttpStatus.OK);
    }

    private async updateProductCart(userId: string, cartProduct: CartProductDto) {
        const updated = await this._CartModel.findOneAndUpdate(
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
            {
                new: true,
            },
        );

        if (!updated) {
            await this._CartModel.updateOne(
                {
                    user: userId,
                    state: CartState.ACTIVE,
                },
                {
                    $push: {
                        cartProducts: cartProduct,
                    },
                },
                {
                    upsert: true,
                    new: true,
                },
            );
        }
    }
}
