import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { AbstractSchema } from '@/database/schemas/abstract.schema';
import { SocialProvider, UserRoles, UserStatus } from '@/modules/user/constants';

const COLLECTION_NAME = 'users';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: COLLECTION_NAME, timestamps: true })
export class User extends AbstractSchema {
    @Prop({ maxlength: 150, trim: true })
    name: string;

    @Prop({ unique: true, required: true, trim: true })
    email: string;

    @Prop({ default: null })
    password: string;

    @Prop({ enum: UserStatus, default: UserStatus.IN_ACTIVE })
    status: string;

    @Prop({ enum: SocialProvider, default: null })
    socialProvider: string;

    @Prop({ default: null })
    image: string;

    @Prop({ type: Boolean, default: false })
    verify: boolean;

    @Prop()
    verificationCode: string;

    @Prop({ enum: UserRoles, default: UserRoles.USER })
    role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
