import { Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ResponseDto } from '@/dto/core';
import { SocialUser } from '@/modules/auth/decorators/social-user.decorator';
import { SocialUserTokenInfoDto } from '@/modules/auth/dto';
import { SocialTokenVerificationGuard } from '@/modules/auth/guards/social-token-verification.guard';
import { SocialAuthService } from '@/modules/auth/social-auth.service';

class SocialTokenInfoDtoType extends ResponseDto(SocialUserTokenInfoDto) {}

@Controller('social-auth')
@ApiTags('Social Auth')
export class SocialAuthController {
    constructor(private readonly _SocialAuthService: SocialAuthService) {}

    @Post('verify-login')
    @UseGuards(SocialTokenVerificationGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOkResponse({
        type: SocialTokenInfoDtoType,
        description: 'User info with token',
    })
    verifyLoginOrRegister(@SocialUser() user: any) {
        return this._SocialAuthService.verifyLoginOrRegister(user);
    }
}
