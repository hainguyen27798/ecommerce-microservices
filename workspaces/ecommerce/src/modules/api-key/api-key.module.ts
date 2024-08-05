import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ApiKey, ApiKeySchema } from '@/modules/api-key/schemas/api-key.schema';

import { ApiKeyService } from './api-key.service';

@Module({
    providers: [ApiKeyService],
    imports: [
        MongooseModule.forFeature([
            {
                name: ApiKey.name,
                schema: ApiKeySchema,
            },
        ]),
    ],
})
export class ApiKeyModule {}
