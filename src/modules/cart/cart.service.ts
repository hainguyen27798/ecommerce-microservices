import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Cart } from '@/modules/cart/schemas/cart.schema';

@Injectable()
export class CartService {
    constructor(@InjectModel(Cart.name) private readonly _CartModel: Model<Cart>) {}
}
