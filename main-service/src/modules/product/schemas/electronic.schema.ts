import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { AbstractSchema } from '@/database/schemas/abstract.schema';

const COLLECTION_NAME = 'electronics';

export type ElectronicDocument = HydratedDocument<Electronic>;

@Schema({ collection: COLLECTION_NAME, timestamps: true })
export class Electronic extends AbstractSchema {
    @Prop({ required: true, trim: true })
    manufacturer: string;

    @Prop({ required: true, trim: true })
    model: string;

    @Prop({ required: true, trim: true })
    color: string;
}

export const ElectronicSchema = SchemaFactory.createForClass(Electronic);
