import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { handlers } from '@/modules/order/commands';
import { Order, OrderSchema } from '@/modules/order/schemas/order.schema';

import { OrderService } from './order.service';

@Module({
    providers: [OrderService, ...handlers],
    imports: [MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }])],
})
export class OrderModule {}
