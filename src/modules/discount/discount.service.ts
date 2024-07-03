import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PageOptionsDto, SuccessDto } from '@/dto/core';
import { ApplyType } from '@/modules/discount/constants/apply-type';
import { CreateDiscountDto, DiscountAmountDto, DiscountDto } from '@/modules/discount/dto';
import { Discount, DiscountDocument } from '@/modules/discount/schemas/discount.schema';
import { DiscountValidator } from '@/modules/discount/validators';
import { CheckSpecificProductsCommand, SearchProductsCommand } from '@/modules/product/commands';
import { FilterQueryType, TObjectId } from '@/types';

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

    private async getDiscountByCode(filter: FilterQueryType<Discount>) {
        const discount = await this._DiscountModel
            .findOne({
                ...filter,
                isActive: true,
            })
            .lean();

        if (!discount) {
            throw new NotFoundException('discount is not found');
        }

        return discount as DiscountDocument;
    }

    async getDiscountsByShop(shopId: TObjectId, pageOption: PageOptionsDto) {
        const discounts = await this._DiscountModel
            .find(
                {
                    shop: shopId,
                    applyType: ApplyType.FOR_BILL,
                    isActive: true,
                },
                {},
                {
                    limit: pageOption.take,
                    skip: pageOption.skip,
                    sort: 'createdAt',
                },
            )
            .lean();

        return new SuccessDto('', HttpStatus.OK, discounts, DiscountDto);
    }

    async getTotalAfterDiscount(userId: string, discountAmountDto: DiscountAmountDto) {
        const discount = await this.getDiscountByCode({
            shop: discountAmountDto.shopId,
            code: discountAmountDto.discountCode,
            applyType: ApplyType.FOR_BILL,
            endDate: { $gt: Date.now() },
            startDate: { $lt: Date.now() },
        });

        // set discount info data
        const discountValidator = new DiscountValidator(discount);

        // verify
        discountValidator.checkMaxSlots();
        discountValidator.checkMaxSlotsPerUser(userId);

        // set discount product infos
        discountValidator.setDiscountProducts(discountAmountDto.product);

        const products = await this._CommandBus.execute(
            new SearchProductsCommand({
                _id: { $in: discountValidator.productIds },
                shop: discountAmountDto.shopId,
            }),
        );

        // set product infos
        discountValidator.setProducts(products);

        // verify
        discountValidator.verifyProductWithApplyType();
        discountValidator.verifyMinAmount();

        return new SuccessDto('', HttpStatus.OK, discountValidator.getFinalAmounts());
    }
}
