import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Order } from '@/modules/order/schemas/order.schema';
import { NewOrderType } from '@/modules/order/types';

@Injectable()
export class OrderService {
    constructor(@InjectModel(Order.name) private readonly _OrderModel: Model<Order>) {}

    createNew(order: NewOrderType) {
        return this._OrderModel.create(order);
    }
}
