import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { values } from 'lodash';
import { HydratedDocument } from 'mongoose';

import { AbstractSchema } from '@/database/schemas/abstract.schema';
import { ApiPermissions } from '@/modules/api-key/constants';

const COLLECTION_NAME = 'api-keys';

export type ApiKeyDocument = HydratedDocument<ApiKey>;

@Schema({ collection: COLLECTION_NAME, timestamps: true })
export class ApiKey extends AbstractSchema {
    @Prop({ required: true, trim: true })
    key: string;

    @Prop({ type: Boolean, required: true, default: true })
    status: boolean;

    @Prop({ type: [String], required: true, enum: values(ApiPermissions), default: [] })
    permissions: string[];
}

export const ApiKeySchema = SchemaFactory.createForClass(ApiKey);
