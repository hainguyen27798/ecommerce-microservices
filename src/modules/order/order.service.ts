import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';

import { Order } from '@/modules/order/schemas/order.schema';
import { NewOrderType } from '@/modules/order/types';

@Injectable()
export class OrderService {
    constructor(@InjectModel(Order.name) private readonly _OrderModel: Model<Order>) {}

    async createNew(order: NewOrderType, session: ClientSession | null = null) {
        const data = await this._OrderModel.create([order], {
            session: session,
        });
        return data?.length > 0 ? data[0] : null;
    }
}
