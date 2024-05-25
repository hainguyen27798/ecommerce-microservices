import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateProductDto } from '@/modules/product/dto/create-product.dto';
import { Product } from '@/modules/product/schemas/product.schema';
import { TAuthUser } from '@/modules/token/types';

@Injectable()
export class ProductService {
    constructor(@InjectModel(Product.name) private readonly _ProductModel: Model<Product>) {}

    async create(shop: TAuthUser, createProductDto: CreateProductDto) {}
}
