import { Injectable } from '@nestjs/common';
import { KafkaOptions, Transport } from '@nestjs/microservices';
import { ClientsModuleOptionsFactory } from '@nestjs/microservices/module/interfaces/clients-module.interface';

import { Configuration } from '@/config/configuration';

@Injectable()
export class NotificationServiceConfig implements ClientsModuleOptionsFactory {
    createClientOptions(): KafkaOptions {
        return {
            transport: Transport.KAFKA,
            options: Configuration.instance.notificationBrokerOptions,
        };
    }
}
