import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppService } from '@/app.service';
import { Configuration } from '@/config/configuration';
import { DatabaseModule } from '@/database/database.module';
import { Notification, NotificationSchema } from '@/schemas/notification.schema';

import { AppController } from './app.controller';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.env.${process.env.NODE_ENV}`,
            isGlobal: true,
            load: [Configuration.init],
        }),
        DatabaseModule,
        MongooseModule.forFeature([
            {
                name: Notification.name,
                schema: NotificationSchema,
            },
        ]),
    ],
    providers: [AppService],
    controllers: [AppController],
})
export class AppModule {}
