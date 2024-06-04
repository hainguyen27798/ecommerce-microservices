import { HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToClass } from 'class-transformer';
import _ from 'lodash';
import mongoose, { Model } from 'mongoose';

import { SuccessDto } from '@/dto/core';
import { CreateProductDto } from '@/modules/product/dto/create-product.dto';
import { ProductDto } from '@/modules/product/dto/product.dto';
import { SearchProductDto } from '@/modules/product/dto/search-product.dto';
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

    async findProductOwner(shopId: string, searchDro: SearchProductDto) {
        const filter: mongoose.FilterQuery<Product> = {
            shop: shopId,
        };

        if (searchDro.publishedOnly) {
            filter.isDraft = false;
        }

        if (searchDro.search) {
            filter.$text = {
                $search: searchDro.search,
            };
        }

        const products = await this._ProductModel.find(filter, { score: { $meta: 'textScore' } }).lean();
        return new SuccessDto(null, HttpStatus.OK, products, ProductDto);
    }

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

    async getOwnerDraft(shopId: string) {
        const products = await this._ProductModel
            .find({
                shop: shopId,
                isDraft: true,
            })
            .populate('shop', 'name email -_id')
            .sort({ updatedAt: -1 })
            .lean();
        return new SuccessDto(null, HttpStatus.OK, products, ProductDto);
    }

    async publishProduct(shopId: string, productId: mongoose.Types.ObjectId) {
        const product = await this._ProductModel.findOneAndUpdate(
            {
                _id: productId,
                shop: shopId,
                isDraft: true,
            },
            {
                isDraft: false,
            },
        );

        if (!product) {
            throw new NotFoundException('Product draft not found');
        }

        return new SuccessDto('Publish product successfully', HttpStatus.OK);
    }

    async unpublishProduct(shopId: string, productId: mongoose.Types.ObjectId) {
        const product = await this._ProductModel.findOneAndUpdate(
            {
                _id: productId,
                shop: shopId,
                isDraft: false,
            },
            {
                isDraft: true,
            },
        );

        if (!product) {
            throw new NotFoundException('Product published not found');
        }

        return new SuccessDto('Un-publish product successfully', HttpStatus.OK);
    }
}
