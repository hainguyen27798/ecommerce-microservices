import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

import { AbstractSchema } from '@/database/schemas/abstract.schema';
import { Cart } from '@/modules/cart/schemas/cart.schema';
import { Product } from '@/modules/product/schemas/product.schema';
import { User } from '@/modules/user/schemas/user.schema';

const COLLECTION_NAME = 'inventories';

export type InventoryDocument = HydratedDocument<Inventory>;

@Schema({ _id: false })
export class ReservationItem {
    @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: Product.name })
    product: Product;

    @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: Cart.name })
    cart: Product;

    @Prop({ required: true })
    quantity: number;
}

@Schema({ collection: COLLECTION_NAME, timestamps: true })
export class Inventory extends AbstractSchema {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: Product.name, required: true })
    product: Product;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: true })
    shop: User;

    @Prop({ type: String, default: 'unknown' })
    location: string;

    @Prop({ type: Number, required: true })
    stock: number;

    @Prop({ type: Array<ReservationItem>, default: [] })
    reservation: ReservationItem[];
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
