import { Firestore } from '@firebase/firestore';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { Model } from 'mongoose';

import { Configuration } from '@/config/configuration';
import { Notification } from '@/schemas/notification.schema';
import { NotificationPayloadType } from '@/types/notification-payload.type';

@Injectable()
export class AppService {
    private readonly _Firestore: Firestore;

    constructor(@InjectModel(Notification.name) private readonly _NotificationModel: Model<Notification>) {
        const app = initializeApp(Configuration.instance.firebase);
        this._Firestore = getFirestore(app);
    }

    async pushNotificationToSystem(payload: NotificationPayloadType) {
        try {
            await this._NotificationModel.create(payload);
            Logger.debug(`${payload.senderId} pushed notification to system`);
        } catch (_e) {
            Logger.error(`${payload.senderId.toString()} failed to push the notification to the system: ${_e.message}`);
        } finally {
        }
    }
}
