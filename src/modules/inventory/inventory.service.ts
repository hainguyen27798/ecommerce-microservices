import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Inventory } from '@/modules/inventory/schemas/inventory.schema';
import { InventoryType } from '@/modules/inventory/types';

@Injectable()
export class InventoryService {
    constructor(@InjectModel(Inventory.name) private readonly _InventoryModel: Model<Inventory>) {}

    async create(inventory: InventoryType) {
        await this._InventoryModel.create(inventory);
    }
}
