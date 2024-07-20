import { CheckoutTotalPriceType } from '@/modules/discount/types';

export type CheckoutSummaryType = Pick<CheckoutTotalPriceType, 'totalPriceAfterDiscount' | 'totalPrice'>;
