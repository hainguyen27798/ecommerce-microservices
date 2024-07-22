import { ProductDocument } from '@/modules/product/schemas/product.schema';

export type ProductCheckoutDiscountType = {
    product: ProductDocument;
    quantity: number;
};

export type CheckoutDiscountType = {
    discountCode: string;
    shopId: string;
    products: ProductCheckoutDiscountType[];
};
