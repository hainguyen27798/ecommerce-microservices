import { Body, Controller, Get, Param, Post, Query, ValidationPipe } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

import { PageOptionsDto, ResponseDto } from '@/dto/core';
import { Auth } from '@/modules/auth/decorators';
import { AuthUser } from '@/modules/auth/decorators/auth-user.decorator';
import { DiscountService } from '@/modules/discount/discount.service';
import { CreateDiscountDto, DiscountDto } from '@/modules/discount/dto';
import { TAuthUser } from '@/modules/token/types';
import { UserRoles } from '@/modules/user/constants';

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

    @Get(':discountCode/products')
    getProductsByDiscountCodes(
        @Param('discountCode') discountCode: string,
        @Query(new ValidationPipe({ transform: true })) pageOption: PageOptionsDto,
    ) {
        return this._DiscountService.getProductsByDiscountCodes(discountCode, pageOption);
    }
}
