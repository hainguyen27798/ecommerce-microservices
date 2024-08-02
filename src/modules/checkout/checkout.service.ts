import { BadRequestException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectConnection } from '@nestjs/mongoose';
import { groupBy, keys, map, sumBy } from 'lodash';
import { ClientSession, Connection } from 'mongoose';

import { SuccessDto } from '@/dto/core';
import { GetCartByCommands, PullProductInCartCommand } from '@/modules/cart/commands';
import { CartProductDto } from '@/modules/cart/dto';
import { CheckoutCommitDto, CheckoutDto, DiscountApplyDto } from '@/modules/checkout/dto';
import { CheckoutSummaryType } from '@/modules/checkout/types';
import { CalculateAndRegisterUserToDiscountCommand, CheckoutDiscountCommand } from '@/modules/discount/commands';
import { CheckoutDiscountType, CheckoutTotalPriceType } from '@/modules/discount/types';
import { ReservationCommand } from '@/modules/inventory/commands';
import { CreateNewOrderCommand } from '@/modules/order/commands';
import { OrderStatus } from '@/modules/order/constants';
import { VerifyCheckoutProductCommand, VerifyCheckoutProductsCommand } from '@/modules/product/commands';
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
        // check cart
        await this.checkCart(userId, checkoutData.cartId);

        const session = await this._Connection.startSession();
        const products: ProductDocument[] = [];
        let bill: CheckoutSummaryType;

        try {
            session.startTransaction();
            Logger.debug('Checkout Transaction - Start');

            // check and checkout products from inventories
            for (const cartProduct of checkoutData.cartProducts) {
                const res = await this._RedisService.acquireLock<boolean>(
                    `lock_product_${cartProduct.product}`,
                    async () => {
                        // verify and get product
                        const product = await this._CommandBus.execute(
                            new VerifyCheckoutProductCommand(
                                {
                                    product: cartProduct.product,
                                    shop: cartProduct.shop,
                                },
                                session,
                            ),
                        );

                        if (!product) {
                            return false;
                        }

                        // pull product in cart
                        const isPull = await this._CommandBus.execute(
                            new PullProductInCartCommand(userId, cartProduct, session),
                        );

                        if (!isPull) {
                            Logger.error('Cart product infos incorrect');
                            return false;
                        }

                        products.push(product);

                        // deduct product quantity to inventory
                        return this._CommandBus.execute(
                            new ReservationCommand(
                                {
                                    product: cartProduct.product,
                                    cart: checkoutData.cartId,
                                    quantity: cartProduct.quantity,
                                },
                                session,
                            ),
                        );
                    },
                );

                if (res?.key) {
                    // release product keys in redis
                    await this._RedisService.release(res.key);
                }

                if (!res || !res.value) {
                    await session.abortTransaction();
                    Logger.debug('Checkout Transaction - Rollback');
                    throw new BadRequestException('Please check your cart.');
                }
            }

            // verify and register to discount
            try {
                // calculate total of bill
                const groupProductsByShop = this.groupProductsByShop(products, checkoutData.cartProducts);
                const discountCodesMap = this.groupDiscountByShop(checkoutData.discountApplies);

                const checkoutByShops = await Promise.all(
                    map(keys(groupProductsByShop), (shopId) =>
                        this.commitCheckoutDiscount(
                            userId,
                            {
                                shopId,
                                products: groupProductsByShop[shopId],
                                discountCode: discountCodesMap?.[shopId],
                            },
                            session,
                        ),
                    ),
                );

                bill = this.getBill(checkoutByShops);
            } catch (_e) {
                await session.abortTransaction();
                Logger.debug('Checkout Transaction - Rollback (reason: discount infos incorrect)');
                throw new BadRequestException('Please check discount infos.');
            }

            // create order
            try {
                await this._CommandBus.execute(
                    new CreateNewOrderCommand(
                        {
                            totalPrice: bill.totalPrice,
                            totalPriceAfterDiscount: bill.totalPriceAfterDiscount,
                            feeShip: 0,
                            orderProducts: checkoutData.cartProducts,
                            user: userId,
                            shippingInfo: checkoutData.shippingInfo,
                            paymentInfo: checkoutData.paymentInfo,
                            discountInfos: checkoutData.discountApplies || [],
                            note: checkoutData.note,
                            status: OrderStatus.PENDING,
                        },
                        session,
                    ),
                );
            } catch (_e) {
                await session.abortTransaction();
                Logger.error(_e.message);
                Logger.debug('Checkout Transaction - Rollback (reason: create order failed)');
                throw new BadRequestException('Please check your cart.');
            }

            await session.commitTransaction();
            Logger.debug('Checkout Transaction - Commit');
        } finally {
            await session.endSession();
            Logger.debug('Checkout Transaction - End');
        }

        return new SuccessDto('checkout successfully', HttpStatus.OK, bill);
    }

    private async checkCart(userId: string, cartId: string) {
        // check cart
        const cart = await this._CommandBus.execute(new GetCartByCommands(cartId, userId));
        if (!cart) {
            throw new BadRequestException('Could not find cart');
        }
    }

    private async checkout(userId: string, checkoutData: CheckoutDto): Promise<CheckoutSummaryType> {
        // check cart
        await this.checkCart(userId, checkoutData.cartId);

        // check products
        const products: ProductDocument[] = await this._CommandBus.execute(
            new VerifyCheckoutProductsCommand(checkoutData.cartProducts),
        );
        if (products.length !== checkoutData.cartProducts.length) {
            throw new BadRequestException('Order incorrect');
        }

        // calculate total of bill
        const groupProductsByShop = this.groupProductsByShop(products, checkoutData.cartProducts);
        const discountCodesMap = this.groupDiscountByShop(checkoutData.discountApplies);

        const checkoutByShops = await Promise.all(
            map(keys(groupProductsByShop), (shopId) =>
                this.checkoutDiscount(userId, {
                    shopId,
                    products: groupProductsByShop[shopId],
                    discountCode: discountCodesMap?.[shopId],
                }),
            ),
        );

        return this.getBill(checkoutByShops);
    }

    private getBill(checkoutByShops: CheckoutTotalPriceType[]) {
        return checkoutByShops.reduce(
            (rs, shop) => ({
                totalPriceAfterDiscount: rs.totalPriceAfterDiscount + shop.totalPriceAfterDiscount,
                totalPrice: rs.totalPrice + shop.totalPrice,
            }),
            { totalPriceAfterDiscount: 0, totalPrice: 0 },
        );
    }

    private groupProductsByShop(products: ProductDocument[], cartProducts: CartProductDto[]) {
        const productQuantityMap = cartProducts.reduce(
            (rs, product) => ({ ...rs, [product.product]: product.quantity }),
            {},
        );

        return groupBy(
            map(products, (product) => ({ product, quantity: productQuantityMap[product.id] })),
            'product.shop',
        );
    }

    private groupDiscountByShop(discountApplies: DiscountApplyDto[]) {
        return discountApplies?.reduce((rs, discount) => ({ ...rs, [discount.shop]: discount.code }), {});
    }

    private async checkoutDiscount(
        userId: string,
        checkoutData: CheckoutDiscountType,
    ): Promise<CheckoutTotalPriceType> {
        if (!checkoutData.discountCode) {
            return this.getTotalNonDiscount(checkoutData);
        }

        return await this._CommandBus.execute(new CheckoutDiscountCommand(userId, checkoutData));
    }

    private async commitCheckoutDiscount(
        userId: string,
        checkoutData: CheckoutDiscountType,
        session: ClientSession,
    ): Promise<CheckoutTotalPriceType> {
        if (!checkoutData.discountCode) {
            return this.getTotalNonDiscount(checkoutData);
        }

        const lockKey = `lock_discount_${checkoutData.discountCode}`;
        const res = await this._RedisService.acquireLock<CheckoutTotalPriceType>(lockKey, async () => {
            try {
                return this._CommandBus.execute(
                    new CalculateAndRegisterUserToDiscountCommand(userId, checkoutData, session),
                );
            } finally {
                await this._RedisService.release(lockKey);
            }
        });

        return res.value;
    }

    private async getTotalNonDiscount(checkoutData: CheckoutDiscountType): Promise<CheckoutTotalPriceType> {
        return new Promise((resolve) => {
            const totalPrice = sumBy(checkoutData.products, (product) => product.quantity * product.product.price);
            resolve({
                totalPrice,
                totalPriceAfterDiscount: totalPrice,
                discountAmount: null,
                discountType: null,
                shop: checkoutData.shopId,
            });
        });
    }
}
