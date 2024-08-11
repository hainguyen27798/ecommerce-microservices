import { Body, Controller, HttpCode, HttpStatus, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiHeader, ApiHeaders, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { HEADER_KEY } from '@/constants';
import { MessageResponseDto, ResponseDto } from '@/dto/core';
import { AuthService } from '@/modules/auth/auth.service';
import { NewPassword, VerificationCode } from '@/modules/auth/decorators';
import { AccountDto, LoginDto, TokenInfoDto, UserTokenInfoDto } from '@/modules/auth/dto';
import { LocalAuthGuard } from '@/modules/auth/guards/local-auth.guard';

class UserTokenInfoDtoType extends ResponseDto(UserTokenInfoDto) {}
class TokenInfoDtoType extends ResponseDto(TokenInfoDto) {}

@Controller('auth')
@ApiTags('Local Auth')
export class AuthController {
    constructor(private readonly _AuthService: AuthService) {}

    @Post('create-new-account')
    @HttpCode(HttpStatus.OK)
    @ApiBody({
        type: AccountDto,
    })
    @ApiOkResponse({
        type: MessageResponseDto,
    })
    createNewAccount(@Body() accountDto: AccountDto) {
        return this._AuthService.createNewAccount(accountDto);
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiBody({
        type: LoginDto,
    })
    @ApiOkResponse({
        type: UserTokenInfoDtoType,
        description: 'User info with token',
    })
    login(@Req() req: Request) {
        return req.user;
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @ApiHeader({
        name: HEADER_KEY.REFRESH_TOKEN,
        required: true,
    })
    @ApiOkResponse({
        type: MessageResponseDto,
    })
    logout(@Req() req: Request) {
        const refreshToken = req.get(HEADER_KEY.REFRESH_TOKEN);
        return this._AuthService.logout(refreshToken);
    }

    @Post('refresh-token')
    @HttpCode(HttpStatus.OK)
    @ApiHeader({
        name: HEADER_KEY.REFRESH_TOKEN,
        required: true,
    })
    @ApiOkResponse({
        type: TokenInfoDtoType,
        description: 'New token info',
    })
    refreshToken(@Req() req: Request) {
        const refreshToken = req.get(HEADER_KEY.REFRESH_TOKEN);
        return this._AuthService.handleRefreshToken(refreshToken);
    }

    @Patch('active-account')
    @HttpCode(HttpStatus.OK)
    @ApiHeaders([
        {
            name: HEADER_KEY.VERIFICATION_CODE,
            required: true,
        },
        {
            name: HEADER_KEY.NEW_PASSWORD,
            required: true,
        },
    ])
    @ApiOkResponse({
        type: MessageResponseDto,
    })
    activeAccount(@VerificationCode() verificationCode: string, @NewPassword() pass: string) {
        return this._AuthService.activeAccount(verificationCode, pass);
    }
}
