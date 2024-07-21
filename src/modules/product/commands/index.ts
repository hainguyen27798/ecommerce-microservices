import { CheckSpecificProductsHandler } from '@/modules/product/commands/check-specific-products.command';
import { SearchProductsHandler } from '@/modules/product/commands/search-products.command';
import { VerifyCheckoutProductHandler } from '@/modules/product/commands/verify-checkout-product.command';
import { VerifyCheckoutProductsHandler } from '@/modules/product/commands/verify-checkout-products.command';

export * from './check-specific-products.command';
export * from './search-products.command';
export * from './verify-checkout-product.command';
export * from './verify-checkout-products.command';

export const handler = [
    CheckSpecificProductsHandler,
    SearchProductsHandler,
    VerifyCheckoutProductHandler,
    VerifyCheckoutProductsHandler,
];
