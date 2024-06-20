import { BadRequestException, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ApplyType } from '@/modules/discount/constants/apply-type';
import { CreateDiscountDto } from '@/modules/discount/dto';
import { Discount } from '@/modules/discount/schemas/discount.schema';
import { CheckSpecificProductsCommand } from '@/modules/product/commands';

@Injectable()
export class DiscountService {
    constructor(
        @InjectModel(Discount.name) private readonly _DiscountModel: Model<Discount>,
        private readonly _CommandBus: CommandBus,
    ) {}

    async create(shopId: string, createDiscountDto: CreateDiscountDto) {
        // console.log(createDiscountDto);
        if (createDiscountDto.applyType === ApplyType.SPECIFIC) {
            const specificValid = await this._CommandBus.execute(
                new CheckSpecificProductsCommand(shopId, createDiscountDto.specificToProduct),
            );
            if (!specificValid) {
                throw new BadRequestException('specific to product are invalid');
            }
        }
    }
}
