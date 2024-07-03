import { CreateInventoryHandler } from '@/modules/inventory/commands/create-inventory.command';

export * from './create-inventory.command';

export const handler = [CreateInventoryHandler];
