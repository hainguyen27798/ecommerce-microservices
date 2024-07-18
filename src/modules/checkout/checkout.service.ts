import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { groupBy, keys, map, sumBy } from 'lodash';

import { SuccessDto } from '@/dto/core';
import { GetCartByCommands } from '@/modules/cart/commands';
import { CheckoutDto } from '@/modules/checkout/dto';
import { CheckoutDiscountCommand } from '@/modules/discount/commands';
import { CheckoutDiscountType, CheckoutTotalPriceType } from '@/modules/discount/types';
import { VerifyCheckoutProductsCommand } from '@/modules/product/commands';
import { ProductDocument } from '@/modules/product/schemas/product.schema';

@Injectable()
export class CheckoutService {
    constructor(private readonly _CommandBus: CommandBus) {}

    async checkoutReview(userId: string, checkoutData: CheckoutDto) {
        // check cart
        const cart = await this._CommandBus.execute(new GetCartByCommands(checkoutData.cartId, userId));
        if (!cart) {
            throw new BadRequestException('Could not find cart');
        }

        // check products
        const products: ProductDocument[] = await this._CommandBus.execute(
            new VerifyCheckoutProductsCommand(checkoutData.cartProducts),
        );
        if (products.length !== checkoutData.cartProducts.length) {
            throw new BadRequestException('Order incorrect');
        }

        // calculate total of bill
        const productQuantityMap = checkoutData.cartProducts.reduce(
            (rs, product) => ({ ...rs, [product.product]: product.quantity }),
            {},
        );
        const groupProductsByShop = groupBy(
            map(products, (product) => ({ product, quantity: productQuantityMap[product.id] })),
            'product.shop',
        );

        const discountCodesMap = checkoutData.discountApplies?.reduce(
            (rs, discount) => ({ ...rs, [discount.shop]: discount.code }),
            {},
        );

        const checkoutByShops = await Promise.all(
            map(keys(groupProductsByShop), (shopId) =>
                this.checkoutDiscount(userId, {
                    shopId,
                    products: groupProductsByShop[shopId],
                    discountCode: discountCodesMap?.[shopId],
                }),
            ),
        );

        const summaryCheckout = checkoutByShops.reduce(
            (rs, shop) => ({
                totalOrder: rs.totalOrder + shop.totalOrder,
                totalPrice: rs.totalPrice + shop.totalPrice,
            }),
            { totalOrder: 0, totalPrice: 0 },
        );

        return new SuccessDto('checkout preview', HttpStatus.OK, summaryCheckout);
    }

    private async checkoutDiscount(
        userId: string,
        checkoutData: CheckoutDiscountType,
    ): Promise<CheckoutTotalPriceType> {
        if (!checkoutData.discountCode) {
            return new Promise((resolve) => {
                const totalOrder = sumBy(checkoutData.products, (product) => product.quantity * product.product.price);
                resolve({
                    totalOrder,
                    totalPrice: totalOrder,
                    discountAmount: null,
                    discountType: null,
                    shop: checkoutData.shopId,
                });
            });
        }

        return await this._CommandBus.execute(new CheckoutDiscountCommand(userId, checkoutData));
    }
}
