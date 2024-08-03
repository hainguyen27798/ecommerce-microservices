import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { NotificationService } from '@/modules/notification/notification.service';
import { NotificationPayloadType } from '@/modules/notification/types';

export class PushNotificationToSystemCommand implements ICommand {
    constructor(public readonly payload: NotificationPayloadType) {}
}

@CommandHandler(PushNotificationToSystemCommand)
export class PushNotificationToSystemHandler implements ICommandHandler<PushNotificationToSystemCommand, void> {
    constructor(private readonly _NotificationService: NotificationService) {}

    execute(command: PushNotificationToSystemCommand): Promise<void> {
        return this._NotificationService.pushNotificationToSystem(command.payload);
    }
}
