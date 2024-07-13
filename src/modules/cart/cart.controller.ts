import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Auth } from '@/modules/auth/decorators';
import { AuthUser } from '@/modules/auth/decorators/auth-user.decorator';
import { CartService } from '@/modules/cart/cart.service';
import { CartProductDto, CreateCartDto } from '@/modules/cart/dto';
import { TAuthUser } from '@/modules/token/types';
import { UserRoles } from '@/modules/user/constants';

@Controller('carts')
@ApiTags('Carts')
export class CartController {
    constructor(private readonly _CartService: CartService) {}

    @Auth(UserRoles.USER)
    @Post('add-to-cart')
    addToCart(@AuthUser() user: TAuthUser, @Body() data: CreateCartDto) {
        return this._CartService.addToCart(user.id, data.cartProducts);
    }

    @Auth(UserRoles.USER)
    @Post('update-product-to-cart')
    updateProductToCart(@AuthUser() user: TAuthUser, @Body() cartProduct: CartProductDto) {
        return this._CartService.updateProductToCart(user.id, cartProduct);
    }
}
