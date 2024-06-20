import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Auth } from '@/modules/auth/decorators';
import { AuthUser } from '@/modules/auth/decorators/auth-user.decorator';
import { DiscountService } from '@/modules/discount/discount.service';
import { CreateDiscountDto } from '@/modules/discount/dto';
import { TAuthUser } from '@/modules/token/types';
import { UserRoles } from '@/modules/user/constants';

@Controller('discounts')
@ApiTags('Discounts')
export class DiscountController {
    constructor(private _DiscountService: DiscountService) {}

    @Post()
    @Auth(UserRoles.SHOP, UserRoles.SUPERUSER)
    create(@AuthUser() shop: TAuthUser, @Body() createDiscountDto: CreateDiscountDto) {
        return this._DiscountService.create(shop.id, createDiscountDto);
    }
}
