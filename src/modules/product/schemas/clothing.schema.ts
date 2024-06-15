import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { AbstractSchema } from '@/database/schemas/abstract.schema';

const COLLECTION_NAME = 'clothings';

export type ClothingDocument = HydratedDocument<Clothing>;

@Schema({ collection: COLLECTION_NAME, timestamps: true })
export class Clothing extends AbstractSchema {
    @Prop({ required: true, trim: true })
    brand: string;

    @Prop({ required: true, trim: true })
    size: string;

    @Prop({ required: true, trim: true })
    material: string;
}

export const ClothingSchema = SchemaFactory.createForClass(Clothing);
