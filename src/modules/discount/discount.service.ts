import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PageOptionsDto, SuccessDto } from '@/dto/core';
import { ApplyType } from '@/modules/discount/constants/apply-type';
import { CreateDiscountDto, DiscountDto } from '@/modules/discount/dto';
import { Discount } from '@/modules/discount/schemas/discount.schema';
import { CheckSpecificProductsCommand, SearchProductsCommand } from '@/modules/product/commands';
import { ProductDto } from '@/modules/product/dto/product.dto';
import { TObjectId } from '@/types';

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

    private async getDiscountByCode(shopId: TObjectId, code: string) {
        const discount = await this._DiscountModel
            .findOne({
                shop: shopId,
                isActive: true,
                code,
            })
            .lean();

        if (!discount) {
            throw new NotFoundException('discount is not found');
        }

        return discount;
    }

    async getProductsByDiscountCodes(shopId: TObjectId, code: string, pageOption: PageOptionsDto) {
        const discount = await this.getDiscountByCode(shopId, code);

        let products: ProductDto[];
        if (discount.applyType === ApplyType.SPECIFIC) {
            products = await this._CommandBus.execute(
                new SearchProductsCommand(
                    {
                        isDraft: false,
                        shop: shopId,
                        _id: { $in: discount.specificToProduct },
                    },
                    pageOption,
                ),
            );
        } else {
            products = await this._CommandBus.execute(
                new SearchProductsCommand(
                    {
                        isDraft: false,
                        shop: shopId,
                    },
                    pageOption,
                ),
            );
        }

        return new SuccessDto('', HttpStatus.OK, products);
    }

    async getDiscountsByShop(shopId: TObjectId, pageOption: PageOptionsDto) {
        const discounts = await this._DiscountModel
            .find(
                {
                    shop: shopId,
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
}
