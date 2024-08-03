import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

import { AbstractSchema } from '@/database/schemas/abstract.schema';
import { NotificationType } from '@/modules/notification/constants';

const COLLECTION_NAME = 'notifications';

@Schema({ collection: COLLECTION_NAME, timestamps: true })
export class Notification extends AbstractSchema {
    @Prop({ type: String, enum: NotificationType, required: true })
    type: NotificationType;

    @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
    senderId: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
    receiverId: string;

    @Prop({ type: Boolean, default: false })
    read: boolean;

    @Prop({ type: String, required: true })
    content: string;

    @Prop({ type: Object })
    options: unknown;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
