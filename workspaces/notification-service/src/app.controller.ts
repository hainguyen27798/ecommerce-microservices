import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { AppService } from '@/app.service';
import { NotificationPayloadType } from '@/types';

@Controller()
export class AppController {
    constructor(private readonly _AppService: AppService) {}

    @EventPattern('create_notification')
    async createNotification(@Payload() data: NotificationPayloadType) {
        await this._AppService.pushNotificationToSystem(data);
    }
}
