import { CheckoutTotalPriceType } from '@/modules/discount/types';

export type CheckoutSummaryType = Pick<CheckoutTotalPriceType, 'totalPrice' | 'totalOrder'>;
