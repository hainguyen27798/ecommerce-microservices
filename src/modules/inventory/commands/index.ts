import { CreateInventoryHandler } from '@/modules/inventory/commands/create-inventory.command';
import { DeleteInventoryHandler } from '@/modules/inventory/commands/delete-inventory.command';
import { ReservationHandler } from '@/modules/inventory/commands/reservation.command';

export * from './create-inventory.command';
export * from './delete-inventory.command';
export * from './reservation.command';

export const handler = [CreateInventoryHandler, ReservationHandler, DeleteInventoryHandler];
