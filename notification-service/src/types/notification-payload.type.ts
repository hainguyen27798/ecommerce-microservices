export type NotificationPayloadType = {
    type: string;
    senderId: string;
    receiverId: string;
    content: string;
    options?: unknown;
};
