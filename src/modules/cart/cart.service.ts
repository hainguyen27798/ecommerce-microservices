import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SuccessDto } from '@/dto/core';
import { CartState } from '@/modules/cart/constants';
import { CartDto, CartProductDto, ProductCartDto } from '@/modules/cart/dto';
import { Cart } from '@/modules/cart/schemas/cart.schema';
import { CheckSpecificProductsCommand } from '@/modules/product/commands';

@Injectable()
export class CartService {
    constructor(
        @InjectModel(Cart.name) private readonly _CartModel: Model<Cart>,
        private readonly _CommandBus: CommandBus,
    ) {}

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

    async updateProductToCart(userId: string, cartProduct: CartProductDto) {
        const valid = await this._CommandBus.execute(
            new CheckSpecificProductsCommand(cartProduct.shop, [cartProduct.product], false),
        );

        if (!valid) {
            throw new BadRequestException('Product is not existed');
        }

        const userCart = await this._CartModel.findOne({
            user: userId,
        });

        if (!userCart) {
            const newCart = await this.createCart(userId, [cartProduct]);
            return new SuccessDto('Created new cart', HttpStatus.CREATED, newCart, CartDto);
        }

        const updated = await this.updateProductCart(userId, cartProduct);

        if (!updated) {
            await this.deleteProductInCart(userId, cartProduct.product);
        }
    }

    private async createCart(userId: string, cartProducts: CartProductDto[]) {
        return this._CartModel.create({
            user: userId,
            state: CartState.ACTIVE,
            cartProducts,
        });
    }

    private async deleteProductInCart(userId: string, productId: string) {
        return this._CartModel.findOneAndUpdate(
            {
                user: userId,
                'cartProducts.product': productId,
            },
            {
                $pull: { cartProducts: { product: productId } },
            },
        );
    }

    private async updateProductCart(userId: string, cartProduct: CartProductDto) {
        const result = await this._CartModel.findOne({
            user: userId,
            state: CartState.ACTIVE,
            'cartProducts.product': cartProduct.product,
        });

        if (!result) {
            return this._CartModel.findOneAndUpdate(
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

        return this._CartModel.findOneAndUpdate(
            {
                'cartProducts.product': cartProduct.product,
                'cartProducts.quantity': {
                    $gt: cartProduct.quantity < 0 ? -cartProduct.quantity : 0,
                },
            },
            {
                $inc: {
                    'cartProducts.$.quantity': cartProduct.quantity,
                },
            },
        );
    }
}
