import { CreateNewOrderHandler } from '@/modules/order/commands/create-new-order.command';

export * from './create-new-order.command';

export const handlers = [CreateNewOrderHandler];
