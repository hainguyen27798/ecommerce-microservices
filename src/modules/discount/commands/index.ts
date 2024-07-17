import { CheckoutDiscountHandler } from '@/modules/discount/commands/checkout-discount.command';

export * from './checkout-discount.command';

export const handler = [CheckoutDiscountHandler];
