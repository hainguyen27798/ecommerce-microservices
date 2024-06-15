import { Inject, Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';

import { ProductTypes } from '@/modules/product/constants';
import { PRODUCT_DETAIL_MODELS } from '@/modules/product/schemas/product-details-model-registry';

@Injectable()
export class ProductDetailsService {
    constructor(@Inject(PRODUCT_DETAIL_MODELS) private _ProductDetailModels: Record<string, Model<unknown>>) {}

    async create(type: ProductTypes, attributes: object) {
        return this._ProductDetailModels[type].create(attributes);
    }

    async update(productId: mongoose.Types.ObjectId, type: string, attributes: object) {
        await this._ProductDetailModels[type].findByIdAndUpdate(productId, attributes);
    }

    async delete(productId: mongoose.Types.ObjectId, type: string) {
        await this._ProductDetailModels[type].findByIdAndDelete(productId);
    }
}
