import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { ClientSession, Model } from 'mongoose';

import { LoggerServerHelper, toObjectId } from '@/helpers';
import { Inventory } from '@/modules/inventory/schemas/inventory.schema';
import { InventoryType, ReservationRequestType } from '@/modules/inventory/types';

@Injectable()
export class InventoryService {
    constructor(@InjectModel(Inventory.name) private readonly _InventoryModel: Model<Inventory>) {}

    async create(inventory: InventoryType) {
        await this._InventoryModel.create(inventory);
    }

    async reservation(request: ReservationRequestType, session: ClientSession | null = null) {
        const productId = toObjectId(request.product);
        const cartId = toObjectId(request.cart);
        const inventory = await this._InventoryModel.updateOne(
            {
                product: request.product,
                stock: { $gte: request.quantity },
            },
            {
                $inc: {
                    stock: -request.quantity,
                },
                $push: {
                    reservation: {
                        product: productId,
                        cart: cartId,
                        quantity: request.quantity,
                    },
                },
            },
            { upsert: true, new: true, session: session },
        );

        if (!inventory.modifiedCount) {
            LoggerServerHelper.error(`Inventory - product ${request.product} not found.`);
            return false;
        }

        return true;
    }

    async delete(
        productId: mongoose.Types.ObjectId,
        shopId: mongoose.Types.ObjectId,
        session: ClientSession | null = null,
    ) {
        await this._InventoryModel.deleteOne({ product: productId, shop: shopId }, { session });
    }
}
