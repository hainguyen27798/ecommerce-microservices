import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { handlers } from '@/modules/notification/commands';
import { Notification, NotificationSchema } from '@/modules/notification/schemas/notification.schema';

import { NotificationService } from './notification.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Notification.name,
                schema: NotificationSchema,
            },
        ]),
    ],
    providers: [NotificationService, ...handlers],
})
export class NotificationModule {}
