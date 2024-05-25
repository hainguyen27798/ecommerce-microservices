import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

import { AbstractSchema } from '@/database/schemas/abstract.schema';
import { ProductAttributes } from '@/modules/product/schemas/product-attributes.schema';
import { User } from '@/modules/user/schemas/user.schema';

const COLLECTION_NAME = 'products';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ collection: COLLECTION_NAME, timestamps: true })
export class Product extends AbstractSchema {
    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ default: null })
    image: string;

    @Prop({ required: true })
    price: number;

    @Prop({ default: 0 })
    quantity: number;

    @Prop({ type: MongooseSchema.Types.ObjectId, name: 'shop_owner', required: true, ref: User.name })
    shop: User;

    @Prop({
        type: [ProductAttributes],
        required: true,
    })
    attributes: ProductAttributes[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
