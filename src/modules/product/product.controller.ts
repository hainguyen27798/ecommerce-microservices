import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { Auth } from '@/modules/auth/decorators';
import { AuthUser } from '@/modules/auth/decorators/auth-user.decorator';
import { CreateProductDto } from '@/modules/product/dto/create-product.dto';
import { ProductService } from '@/modules/product/product.service';
import { TAuthUser } from '@/modules/token/types';
import { UserRoles } from '@/modules/user/constants';

@Controller('products')
@ApiTags('Products')
export class ProductController {
    constructor(private readonly _ProductService: ProductService) {}

    @Get()
    @ApiBody({
        type: CreateProductDto,
    })
    @Auth(UserRoles.SHOP)
    findOwner(@AuthUser() shop: TAuthUser) {
        return this._ProductService.findProductOwner(shop.id);
    }

    @Post()
    @ApiBody({
        type: CreateProductDto,
    })
    @Auth(UserRoles.SHOP)
    create(@AuthUser() shop: TAuthUser, @Body() createProductDto: CreateProductDto) {
        return this._ProductService.create(shop, createProductDto);
    }
}
