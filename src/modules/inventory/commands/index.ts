import { CreateInventoryHandler } from '@/modules/inventory/commands/create-inventory.command';
import { ReservationHandler } from '@/modules/inventory/commands/reservation.command';

export * from './create-inventory.command';
export * from './reservation.command';

export const handler = [CreateInventoryHandler, ReservationHandler];
