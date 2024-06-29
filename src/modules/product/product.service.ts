import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { PartialType } from '@nestjs/swagger';
import { plainToClass, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import _ from 'lodash';
import mongoose, { Model } from 'mongoose';

import { PageOptionsDto, SuccessDto } from '@/dto/core';
import { formatValidateExceptionHelper } from '@/helpers';
import { CreateInventoryCommand } from '@/modules/inventory/commands';
import { CreateProductDto } from '@/modules/product/dto/create-product.dto';
import { ProductDto } from '@/modules/product/dto/product.dto';
import { ProductSubtypeRegistry } from '@/modules/product/dto/product-subtype-registry';
import { SearchProductDto } from '@/modules/product/dto/search-product.dto';
import { UpdateProductDto } from '@/modules/product/dto/update-product.dto';
import { TransformProductAttributes } from '@/modules/product/helpers';
import { ProductDetailsService } from '@/modules/product/product-details.service';
import { Product, ProductDocument } from '@/modules/product/schemas/product.schema';
import { TAuthUser } from '@/modules/token/types';
import { User } from '@/modules/user/schemas/user.schema';
import { FilterQueryType } from '@/types';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name) private readonly _ProductModel: Model<Product>,
        private readonly _CommandBus: CommandBus,
        private readonly _ProductDetailsService: ProductDetailsService,
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

        const products = await this._ProductModel
            .find(filter, searchDro.search ? { score: { $meta: 'textScore' } } : {})
            .lean();
        return new SuccessDto(null, HttpStatus.OK, products, ProductDto);
    }

    async create(shop: TAuthUser, createProductDto: CreateProductDto) {
        const productDetails = await this._ProductDetailsService.create(
            createProductDto.type,
            createProductDto.attributes,
        );

        const productPayload = plainToClass(Product, createProductDto);

        productPayload['_id'] = productDetails._id;
        productPayload.shop = shop.id as unknown as User;
        productPayload.attributes = TransformProductAttributes.objectToArray(createProductDto.attributes);

        const newProduct: ProductDocument = await this._ProductModel.create(productPayload);

        // initialize inventory
        await this._CommandBus.execute(
            new CreateInventoryCommand({
                product: newProduct._id.toString(),
                shop: shop.id,
                stock: newProduct.quantity,
            }),
        );

        return new SuccessDto('Create product successfully', HttpStatus.CREATED, newProduct);
    }

    private async findOneOwnerProduct(shopId: string, productId: mongoose.Types.ObjectId) {
        const product = await this._ProductModel.findOne({
            _id: productId,
            shop: shopId,
        });

        if (!product) {
            throw new NotFoundException('product not found');
        }

        return product;
    }

    private async validateProductAttributes(type: string, attribute: object) {
        // get product attribute schema
        const objectType = PartialType(ProductSubtypeRegistry[type]);

        const object = plainToClass(objectType, attribute);

        const errors = await validate(object);
        if (errors.length) {
            const messages = formatValidateExceptionHelper(errors);
            throw new BadRequestException(messages);
        }

        // remove attributes that are undefined
        return _.pickBy(object, _.identity);
    }

    async update(shopId: string, productId: mongoose.Types.ObjectId, updateProductDto: UpdateProductDto) {
        const product = await this.findOneOwnerProduct(shopId, productId);

        const productPayload = plainToClass(Product, updateProductDto);

        // check and validate product attribute
        if (productPayload.attributes) {
            const attributes = await this.validateProductAttributes(product.type, productPayload.attributes);

            if (_.isEmpty(attributes)) {
                delete productPayload.attributes;
            } else {
                await this._ProductDetailsService.update(productId, product.type, attributes);
                productPayload.attributes = TransformProductAttributes.objectToArray({
                    ...TransformProductAttributes.arrayToObject(product.attributes),
                    ...attributes,
                });
            }
        }

        if (_.isEmpty(productPayload)) {
            throw new BadRequestException('Invalid update payload');
        }

        const productUpdated = await this._ProductModel
            .findByIdAndUpdate(productId, productPayload, { new: true })
            .lean();

        return new SuccessDto(
            'Update product successfully',
            HttpStatus.CREATED,
            plainToClass(ProductDto, productUpdated),
        );
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

    async delete(shopId: string, productId: mongoose.Types.ObjectId) {
        const product = await this._ProductModel
            .findOneAndDelete({
                _id: productId,
                shop: shopId,
            })
            .lean();

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        await this._ProductDetailsService.delete(productId, product.type);

        return new SuccessDto('Delete product successfully', HttpStatus.OK);
    }

    async checkSpecificProducts(shopId: string, productIds: string[]) {
        try {
            const productIdsExisting = await this._ProductModel
                .distinct('_id', {
                    _id: { $in: productIds },
                    shop: shopId,
                })
                .lean();

            return productIdsExisting.length === productIds.length;
        } catch (_e) {
            return false;
        }
    }

    async searchProducts(filter: FilterQueryType<Product>, pageOption: PageOptionsDto = null): Promise<ProductDto[]> {
        const products = await this._ProductModel
            .find(
                filter,
                {},
                pageOption
                    ? {
                          limit: pageOption.take,
                          skip: pageOption.skip,
                          sort: 'createdAt',
                      }
                    : {},
            )
            .lean()
            .exec();

        return plainToInstance(ProductDto, products);
    }
}
