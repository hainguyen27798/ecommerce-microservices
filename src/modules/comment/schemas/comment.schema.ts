import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

import { AbstractSchema } from '@/database/schemas/abstract.schema';
import { Product } from '@/modules/product/schemas/product.schema';
import { User } from '@/modules/user/schemas/user.schema';
import { TObjectId } from '@/types';

const COLLECTION_NAME = 'comments';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ collection: COLLECTION_NAME, timestamps: true })
export class Comment extends AbstractSchema {
    @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: User.name })
    user: User;

    @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: Product.name })
    product: Product;

    @Prop({ trim: true, required: true })
    content: string;

    @Prop({ type: Number })
    left: number;

    @Prop({ type: Number })
    right: number;

    @Prop({ type: MongooseSchema.Types.ObjectId, default: null })
    parentId: TObjectId;

    @Prop({ type: Boolean, default: false })
    isDeleted: boolean;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
