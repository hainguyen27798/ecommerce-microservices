import { NotificationType } from '@/modules/notification/constants';

export type NotificationPayloadType = {
    type: NotificationType;
    senderId: string;
    receiverId: string;
    content: string;
    options?: unknown;
};
