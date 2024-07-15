import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Auth } from '@/modules/auth/decorators';
import { AuthUser } from '@/modules/auth/decorators/auth-user.decorator';
import { CheckoutService } from '@/modules/checkout/checkout.service';
import { CheckoutDto } from '@/modules/checkout/dto';
import { TAuthUser } from '@/modules/token/types';
import { UserRoles } from '@/modules/user/constants';

@Controller('checkout')
@ApiTags('Checkout')
export class CheckoutController {
    constructor(private readonly _CheckoutService: CheckoutService) {}

    @Post('review')
    @Auth(UserRoles.USER)
    checkoutReview(@AuthUser() user: TAuthUser, @Body() checkoutData: CheckoutDto) {
        return this._CheckoutService.checkoutReview(user.id, checkoutData);
    }
}
