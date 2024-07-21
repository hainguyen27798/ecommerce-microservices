import { CalculateAndRegisterUserToDiscountHandler } from '@/modules/discount/commands/calculate-and-register-user-to-discount.command';
import { CheckoutDiscountHandler } from '@/modules/discount/commands/checkout-discount.command';

export * from './calculate-and-register-user-to-discount.command';
export * from './checkout-discount.command';

export const handler = [CheckoutDiscountHandler, CalculateAndRegisterUserToDiscountHandler];
