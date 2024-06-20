import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SuccessDto } from '@/dto/core';
import { ApplyType } from '@/modules/discount/constants/apply-type';
import { CreateDiscountDto, DiscountDto } from '@/modules/discount/dto';
import { Discount } from '@/modules/discount/schemas/discount.schema';
import { CheckSpecificProductsCommand } from '@/modules/product/commands';

@Injectable()
export class DiscountService {
    constructor(
        @InjectModel(Discount.name) private readonly _DiscountModel: Model<Discount>,
        private readonly _CommandBus: CommandBus,
    ) {}

    async create(shopId: string, createDiscountDto: CreateDiscountDto) {
        // check discount code
        await this.checkDiscount(shopId, createDiscountDto.code);

        // check specific products are exited or not
        if (createDiscountDto.applyType === ApplyType.SPECIFIC) {
            const specificValid = await this._CommandBus.execute(
                new CheckSpecificProductsCommand(shopId, createDiscountDto.specificToProduct),
            );
            if (!specificValid) {
                throw new BadRequestException('specific to product are invalid');
            }
        }

        // create
        const newDiscount = await this._DiscountModel.create({
            ...createDiscountDto,
            shop: shopId,
        });

        return new SuccessDto('Created successfully', HttpStatus.CREATED, newDiscount, DiscountDto);
    }

    private async checkDiscount(shopId: string, code: string) {
        const discount = await this._DiscountModel
            .findOne({
                code,
                shop: shopId,
                isActive: true,
            })
            .lean();

        if (!!discount) {
            throw new BadRequestException('discount is exited');
        }
    }
}
