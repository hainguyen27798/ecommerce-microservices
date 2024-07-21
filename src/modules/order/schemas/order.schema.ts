import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

import { AbstractSchema } from '@/database/schemas/abstract.schema';
import { OrderStatus } from '@/modules/order/constants';
import { PaymentMethod } from '@/modules/order/constants/payment-method';
import { PaymentStatus } from '@/modules/order/constants/payment-status';
import { Product } from '@/modules/product/schemas/product.schema';
import { User } from '@/modules/user/schemas/user.schema';

const COLLECTION_NAME = 'orders';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ _id: false })
export class OrderProduct {
    @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: Product.name })
    product: Product;

    @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: User.name })
    shop: Product;

    @Prop({ required: true })
    quantity: number;
}

@Schema({ _id: false })
export class ShippingInfo {
    @Prop({ required: true, trim: true })
    phone: string;

    @Prop({ required: true, trim: true })
    country: string;

    // city/province
    @Prop({ required: true, trim: true })
    province: string;

    @Prop({ required: true, trim: true })
    district: string;

    // ward/commune
    @Prop({ required: true, trim: true })
    commune: string;

    @Prop({ required: true, trim: true })
    address: string;
}

@Schema({ _id: false })
export class PaymentInfo {
    @Prop({ type: String, enum: PaymentMethod, default: PaymentMethod.PAYMENT_ON_DELIVERY })
    paymentMethod: PaymentMethod;

    @Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.PENDING })
    paymentStatus: PaymentStatus;
}

@Schema({ collection: COLLECTION_NAME, timestamps: true })
export class Order extends AbstractSchema {
    @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: User.name })
    user: User;

    @Prop({ type: [OrderProduct], required: true, default: [] })
    orderProducts: OrderProduct[];

    @Prop({ type: Number, required: true })
    totalPrice: number;

    @Prop({ type: Number, required: true })
    totalPriceAfterDiscount: number;

    @Prop({ type: Number, required: true })
    feeShip: number;

    @Prop({ type: ShippingInfo, required: true })
    shippingInfo: ShippingInfo;

    @Prop({ type: String, default: '#0000120220721' })
    trackingNumber: string;

    @Prop({ type: PaymentInfo })
    paymentInfo: PaymentInfo;

    @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PENDING })
    status: OrderStatus;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
