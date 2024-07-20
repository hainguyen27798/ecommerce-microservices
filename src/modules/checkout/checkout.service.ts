import { BadRequestException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectConnection } from '@nestjs/mongoose';
import { groupBy, keys, map, sumBy } from 'lodash';
import { Connection } from 'mongoose';

import { SuccessDto } from '@/dto/core';
import { GetCartByCommands } from '@/modules/cart/commands';
import { CheckoutCommitDto, CheckoutDto } from '@/modules/checkout/dto';
import { CheckoutSummaryType } from '@/modules/checkout/types';
import { CheckoutDiscountCommand } from '@/modules/discount/commands';
import { CheckoutDiscountType, CheckoutTotalPriceType } from '@/modules/discount/types';
import { ReservationCommand } from '@/modules/inventory/commands';
import { VerifyCheckoutProductsCommand } from '@/modules/product/commands';
import { ProductDocument } from '@/modules/product/schemas/product.schema';
import { RedisService } from '@/modules/redis';

@Injectable()
export class CheckoutService {
    constructor(
        private readonly _CommandBus: CommandBus,
        private readonly _RedisService: RedisService,
        @InjectConnection() private readonly _Connection: Connection,
    ) {}

    async checkoutReview(userId: string, checkoutData: CheckoutDto) {
        const summaryCheckout = await this.checkout(userId, checkoutData);
        return new SuccessDto('checkout preview', HttpStatus.OK, summaryCheckout);
    }

    async checkoutCommit(userId: string, checkoutData: CheckoutCommitDto) {
        const summaryCheckout = await this.checkout(userId, checkoutData);

        const session = await this._Connection.startSession();
        const keyLocks = [];

        try {
            session.startTransaction();
            Logger.debug('Transaction - Start');

            for (const cartProduct of checkoutData.cartProducts) {
                const res = await this._RedisService.acquireLock<boolean>(`lock_product_${cartProduct.product}`, () =>
                    this._CommandBus.execute(
                        new ReservationCommand(
                            {
                                product: cartProduct.product,
                                cart: checkoutData.cartId,
                                quantity: cartProduct.quantity,
                            },
                            session,
                        ),
                    ),
                );
                keyLocks.push(res.key);

                if (!res.value) {
                    await session.abortTransaction();
                    Logger.debug('Transaction - Rollback');
                    throw new BadRequestException('Please check your cart.');
                }
            }

            await session.commitTransaction();
            Logger.debug('Transaction - Commit');
        } finally {
            await session.endSession();
            Logger.debug('Transaction - End');
            if (keyLocks.length > 0) {
                await this._RedisService.release(...keyLocks);
            }
        }

        return new SuccessDto('checkout successfully', HttpStatus.OK, summaryCheckout);
    }

    private async checkout(userId: string, checkoutData: CheckoutDto): Promise<CheckoutSummaryType> {
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

        return checkoutByShops.reduce(
            (rs, shop) => ({
                totalOrder: rs.totalOrder + shop.totalOrder,
                totalPrice: rs.totalPrice + shop.totalPrice,
            }),
            { totalOrder: 0, totalPrice: 0 },
        );
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
