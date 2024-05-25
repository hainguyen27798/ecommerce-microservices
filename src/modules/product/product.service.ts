import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToClass } from 'class-transformer';
import _ from 'lodash';
import { Model } from 'mongoose';

import { SuccessDto } from '@/dto/core';
import { CreateProductDto } from '@/modules/product/dto/create-product.dto';
import { Product, ProductDocument } from '@/modules/product/schemas/product.schema';
import { PRODUCT_DETAIL_MODELS } from '@/modules/product/schemas/product-details-model-registry';
import { TAuthUser } from '@/modules/token/types';
import { User } from '@/modules/user/schemas/user.schema';

@Injectable()
export class ProductService {
    constructor(
        @Inject(PRODUCT_DETAIL_MODELS) private _ProductDetailModels: Record<string, Model<unknown>>,
        @InjectModel(Product.name) private readonly _ProductModel: Model<Product>,
    ) {}

    async create(shop: TAuthUser, createProductDto: CreateProductDto) {
        const productDetails = await this._ProductDetailModels[createProductDto.type].create(
            createProductDto.attributes,
        );

        const productPayload = plainToClass(Product, createProductDto);

        productPayload['_id'] = productDetails._id;
        productPayload.shop = shop.id as unknown as User;
        productPayload.attributes = _.map(_.keys(createProductDto.attributes), (key) => ({
            key,
            value: createProductDto.attributes[key],
        }));

        const newProduct: ProductDocument = await this._ProductModel.create(productPayload);
        return new SuccessDto('Create product successfully', HttpStatus.CREATED, newProduct);
    }
}
