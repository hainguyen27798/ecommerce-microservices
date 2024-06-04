import { Body, Controller, Get, Post, Put, Query, ValidationPipe } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import mongoose from 'mongoose';

import { ObjectId } from '@/decorators';
import { MessageResponseDto, ResponseDto } from '@/dto/core';
import { Auth } from '@/modules/auth/decorators';
import { AuthUser } from '@/modules/auth/decorators/auth-user.decorator';
import { CreateProductDto } from '@/modules/product/dto/create-product.dto';
import { ProductDto } from '@/modules/product/dto/product.dto';
import { SearchProductDto } from '@/modules/product/dto/search-product.dto';
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
    @ApiQuery({
        required: false,
        name: 'publishedOnly',
        type: Boolean,
    })
    @ApiOkResponse({
        type: ProductListDto,
    })
    @Auth(UserRoles.SHOP)
    findOwner(
        @AuthUser() shop: TAuthUser,
        @Query(new ValidationPipe({ transform: true })) searchDro: SearchProductDto,
    ) {
        return this._ProductService.findProductOwner(shop.id, searchDro);
    }

    @Post()
    @ApiOkResponse({
        type: ProductDetailsDto,
    })
    @Auth(UserRoles.SHOP)
    create(@AuthUser() shop: TAuthUser, @Body() createProductDto: CreateProductDto) {
        return this._ProductService.create(shop, createProductDto);
    }

    @Get('drafts')
    @ApiOkResponse({
        type: ProductListDto,
    })
    @Auth(UserRoles.SHOP)
    getOwnerDraft(@AuthUser() shop: TAuthUser) {
        return this._ProductService.getOwnerDraft(shop.id);
    }

    @Put('publish/:productId')
    @ApiOkResponse({
        type: MessageResponseDto,
    })
    @Auth(UserRoles.SHOP)
    publishProduct(@AuthUser() shop: TAuthUser, @ObjectId('productId') productId: mongoose.Types.ObjectId) {
        return this._ProductService.publishProduct(shop.id, productId);
    }

    @Put('unpublish/:productId')
    @ApiOkResponse({
        type: MessageResponseDto,
    })
    @Auth(UserRoles.SHOP)
    unpublishProduct(@AuthUser() shop: TAuthUser, @ObjectId('productId') productId: mongoose.Types.ObjectId) {
        return this._ProductService.unpublishProduct(shop.id, productId);
    }
}
