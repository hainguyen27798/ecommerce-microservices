import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ResponseDto } from '@/dto/core';
import { Auth } from '@/modules/auth/decorators';
import { AuthUser } from '@/modules/auth/decorators/auth-user.decorator';
import { CreateProductDto } from '@/modules/product/dto/create-product.dto';
import { ProductDto } from '@/modules/product/dto/product.dto';
import { ProductService } from '@/modules/product/product.service';
import { TAuthUser } from '@/modules/token/types';
import { UserRoles } from '@/modules/user/constants';

class ProductListDto extends ResponseDto(ProductDto, true) {}
class ProductDetailsDto extends ResponseDto(ProductDto) {}

@Controller('products')
@ApiTags('Products')
export class ProductController {
    constructor(private readonly _ProductService: ProductService) {}

    @Get()
    @ApiOkResponse({
        type: ProductListDto,
    })
    @Auth(UserRoles.SHOP)
    findOwner(@AuthUser() shop: TAuthUser) {
        return this._ProductService.findProductOwner(shop.id);
    }

    @Post()
    @ApiOkResponse({
        type: ProductDetailsDto,
    })
    @Auth(UserRoles.SHOP)
    create(@AuthUser() shop: TAuthUser, @Body() createProductDto: CreateProductDto) {
        return this._ProductService.create(shop, createProductDto);
    }
}
