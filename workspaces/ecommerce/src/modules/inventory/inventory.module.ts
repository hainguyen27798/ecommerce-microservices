import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { handler } from '@/modules/inventory/commands';
import { Inventory, InventorySchema } from '@/modules/inventory/schemas/inventory.schema';

import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';

@Module({
    controllers: [InventoryController],
    imports: [MongooseModule.forFeature([{ name: Inventory.name, schema: InventorySchema }])],
    providers: [InventoryService, ...handler],
})
export class InventoryModule {}
