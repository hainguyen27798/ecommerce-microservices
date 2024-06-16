import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

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
    ],
    providers: [DiscountService],
})
export class DiscountModule {}
