import { CheckSpecificProductsHandler } from '@/modules/product/commands/check-specific-products.command';
import { SearchProductsHandler } from '@/modules/product/commands/search-products.command';

export * from './check-specific-products.command';
export * from './search-products.command';

export const handler = [CheckSpecificProductsHandler, SearchProductsHandler];
