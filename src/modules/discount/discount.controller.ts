import { Body, Controller, Get, Param, Post, Query, ValidationPipe } from '@nestjs/common';
import { ApiCreatedResponse, ApiParam, ApiTags } from '@nestjs/swagger';

import { ObjectId } from '@/decorators';
import { PageOptionsDto, ResponseDto } from '@/dto/core';
import { Auth } from '@/modules/auth/decorators';
import { AuthUser } from '@/modules/auth/decorators/auth-user.decorator';
import { DiscountService } from '@/modules/discount/discount.service';
import { CreateDiscountDto, DiscountDto } from '@/modules/discount/dto';
import { TAuthUser } from '@/modules/token/types';
import { UserRoles } from '@/modules/user/constants';
import { TObjectId } from '@/types';

class DiscountDetailDto extends ResponseDto(DiscountDto) {}

@Controller('discounts')
@ApiTags('Discounts')
export class DiscountController {
    constructor(private _DiscountService: DiscountService) {}

    @Post()
    @Auth(UserRoles.SHOP, UserRoles.SUPERUSER)
    @ApiCreatedResponse({
        type: DiscountDetailDto,
    })
    create(@AuthUser() shop: TAuthUser, @Body() createDiscountDto: CreateDiscountDto) {
        return this._DiscountService.create(shop.id, createDiscountDto);
    }

    @Get('shop/:shopId')
    getDiscountsByShop(
        @ObjectId('shopId') shopId: TObjectId,
        @Query(new ValidationPipe({ transform: true })) pageOption: PageOptionsDto,
    ) {
        return this._DiscountService.getDiscountsByShop(shopId, pageOption);
    }

    @Get('shop/:shopId/code/:discountCode/products')
    @ApiParam({
        name: 'shopId',
    })
    getProductsByDiscountCodes(
        @ObjectId('shopId') shopId: TObjectId,
        @Param('discountCode') discountCode: string,
        @Query(new ValidationPipe({ transform: true })) pageOption: PageOptionsDto,
    ) {
        return this._DiscountService.getProductsByDiscountCodes(shopId, discountCode, pageOption);
    }
}
