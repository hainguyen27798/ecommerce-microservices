import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

import { AbstractSchema } from '@/database/schemas/abstract.schema';
import { DiscountType } from '@/modules/discount/constants';
import { ApplyType } from '@/modules/discount/constants/apply-type';
import { User } from '@/modules/user/schemas/user.schema';

const COLLECTION_NAME = 'discounts';

export type DiscountDocument = HydratedDocument<Discount>;

@Schema({ collection: COLLECTION_NAME, timestamps: true })
export class Discount extends AbstractSchema {
    @Prop({ type: String, required: true, trim: true })
    name: string;

    @Prop({ type: String })
    description: string;

    @Prop({ type: String, enum: DiscountType, default: DiscountType.FIXED_AMOUNT })
    type: DiscountType;

    @Prop({ type: Number, required: true })
    value: number;

    @Prop({ type: Boolean, default: true })
    isActive: number;

    @Prop({ type: String, enum: ApplyType, default: true })
    applyType: ApplyType;

    @Prop({ type: [MongooseSchema.Types.ObjectId], default: [] })
    specificToProduct: string[];

    @Prop({ type: Number, required: true })
    maxSlots: number;

    @Prop({ type: Number, default: 0 })
    slotsUsed: number;

    @Prop({ type: Number, required: true })
    maxSlotsPerUser: number;

    @Prop({ type: Number, default: 0 })
    minOrderValue: number;

    @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: User.name })
    shop: User;

    @Prop({ type: [MongooseSchema.Types.ObjectId], default: [] })
    usersUsed: string[];

    @Prop({ type: String, required: true })
    code: string;

    @Prop({ type: Date, required: true })
    startDate: Date;

    @Prop({ type: Date, required: true })
    endDate: Date;
}

export const DiscountSchema = SchemaFactory.createForClass(Discount);
