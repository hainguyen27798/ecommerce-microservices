import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import _ from 'lodash';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import slugify from 'slugify';

import { AbstractSchema } from '@/database/schemas/abstract.schema';
import { ProductTypes } from '@/modules/product/constants';
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

    @Prop({ default: '' })
    description: string;

    @Prop({ enum: ProductTypes, required: true })
    type: string;

    @Prop({ default: '' })
    slug: string;

    @Prop({ type: Boolean, default: true, index: true, select: false })
    isDraft: boolean;

    @Prop({ min: 0, max: 5, default: 4.5, set: (value: number) => _.round(value, 1) })
    rating: number;

    @Prop({ type: MongooseSchema.Types.ObjectId, name: 'shop_owner', required: true, ref: User.name })
    shop: User;

    @Prop({
        type: [ProductAttributes],
        required: true,
    })
    attributes: ProductAttributes[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.index({ name: 'text', description: 'text' });

ProductSchema.pre('save', async function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});
