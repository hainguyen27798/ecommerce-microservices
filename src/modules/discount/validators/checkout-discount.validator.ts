import { BadRequestException } from '@nestjs/common';
import { every, filter, map, reduce, size } from 'lodash';

import { DiscountType } from '@/modules/discount/constants';
import { ApplyType } from '@/modules/discount/constants/apply-type';
import { DiscountDocument } from '@/modules/discount/schemas/discount.schema';
import { CheckoutTotalPriceType, ProductCheckoutDiscountType } from '@/modules/discount/types';
import { ProductDocument } from '@/modules/product/schemas/product.schema';

export class CheckoutDiscountValidator {
    private _products: ProductDocument[];
    private _quantitiesPerProductMap: { [p: string]: number };
    private _totalAmount: number;

    constructor(private readonly _discount: DiscountDocument) {}

    checkMaxSlots() {
        if (this._discount.maxSlots <= this._discount.slotsUsed) {
            throw new BadRequestException('Discount is out');
        }
        return this;
    }

    checkMaxSlotsPerUser(userId: string) {
        const amountUsedByCurrentUser = size(filter(this._discount.usersUsed, (idUsed) => idUsed === userId));
        if (amountUsedByCurrentUser >= this._discount.maxSlotsPerUser) {
            throw new BadRequestException('User slot is out');
        }
        return this;
    }

    setProducts(productCheckoutDiscounts: ProductCheckoutDiscountType[]) {
        this._products = map(productCheckoutDiscounts, 'product');

        this._quantitiesPerProductMap = reduce(
            productCheckoutDiscounts,
            (rs, productCheckoutDiscount) => ({
                ...rs,
                [productCheckoutDiscount.product.id]: productCheckoutDiscount.quantity,
            }),
            {},
        );

        this._totalAmount = reduce(
            this._products,
            (total, product) => total + product.price * this._quantitiesPerProductMap[product.id.toString()],
            0,
        );

        return this;
    }

    verifyProductWithApplyType() {
        if (this._discount.applyType === ApplyType.SPECIFIC) {
            this.checkSpecificToProducts();
        }

        return this;
    }

    private checkSpecificToProducts() {
        const canApply = every(
            this._discount.specificToProduct,
            (productId) => !!this._quantitiesPerProductMap[productId],
        );
        if (!canApply) {
            throw new BadRequestException('Discount could not apply for these products');
        }
    }

    verifyMinAmount() {
        if (this._totalAmount < this._discount.minOrderValue) {
            throw new BadRequestException('The total amount is not enough');
        }
    }

    private calculatePrice(originPrice: number, amount: number, type: DiscountType) {
        let discountPrice = originPrice;
        if (type === DiscountType.FIXED_AMOUNT) {
            discountPrice = discountPrice - amount;
        } else {
            discountPrice = discountPrice * (1 - amount / 100);
        }

        return discountPrice > 0 ? discountPrice : 0;
    }

    private getDiscountPrice() {
        if (this._discount.applyType === ApplyType.FOR_BILL) {
            return this.calculatePrice(this._totalAmount, this._discount.value, this._discount.type);
        }
    }

    getFinalAmounts(): CheckoutTotalPriceType {
        return {
            totalOrder: this._totalAmount,
            totalPrice: this.getDiscountPrice(),
            discountAmount: this._discount.value,
            discountType: this._discount.type,
        };
    }
}
