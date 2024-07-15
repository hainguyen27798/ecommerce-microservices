import { BadRequestException, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { GetCartByCommands } from '@/modules/cart/commands';
import { CheckoutDto } from '@/modules/checkout/dto';
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
        const checkoutPrice = products.reduce((rs, product) => rs + productQuantityMap[product.id] * product.price, 0);

        return checkoutPrice;
    }
}
