import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';

import { handler } from '@/modules/discount/commands';
import { Discount, DiscountSchema } from '@/modules/discount/schemas/discount.schema';

import { DiscountController } from './discount.controller';
import { DiscountService } from './discount.service';

@Module({
    controllers: [DiscountController],
    imports: [
        MongooseModule.forFeature([
            {
                name: Discount.name,
                schema: DiscountSchema,
            },
        ]),
        CqrsModule,
    ],
    providers: [DiscountService, ...handler],
})
export class DiscountModule {}
