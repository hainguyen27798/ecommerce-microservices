import { Body, Controller, Delete, Get, Patch, Post, Put, Query, ValidationPipe } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';

import { ObjectId } from '@/decorators';
import { MessageResponseDto, PageOptionsDto, ResponseDto } from '@/dto/core';
import { Auth } from '@/modules/auth/decorators';
import { UserRoles } from '@/modules/user/constants';
import { RequestUserDto, UserDto } from '@/modules/user/dto';
import { UpdateUserDto } from '@/modules/user/dto/update-user.dto';
import { UserService } from '@/modules/user/user.service';

class UserInfosDto extends ResponseDto(UserDto, true) {}
class UserInfoDto extends ResponseDto(UserDto) {}

@Controller('users')
@ApiTags('Users')
export class UserController {
    constructor(private _UserService: UserService) {}

    @Get()
    @Auth(UserRoles.SUPERUSER)
    @ApiOperation({ description: 'Get all users' })
    @ApiOkResponse({
        type: UserInfosDto,
    })
    getUsers(@Query(new ValidationPipe({ transform: true })) pageOption: PageOptionsDto) {
        return this._UserService.getUsers(pageOption);
    }

    @Post('request')
    @ApiOperation({ description: 'Request a new user' })
    @ApiBody({
        type: RequestUserDto,
    })
    @ApiOkResponse({
        type: UserInfoDto,
    })
    requestUser(@Body() requestUserDto: RequestUserDto) {
        return this._UserService.requestUser(requestUserDto);
    }

    @Put('approve/:id')
    @ApiOperation({ description: 'active user by id' })
    @ApiOkResponse({
        type: MessageResponseDto,
    })
    approveUser(@ObjectId() id: Types.ObjectId) {
        return this._UserService.approveUser(id);
    }

    @Put('resend/:id')
    @ApiOkResponse({
        type: MessageResponseDto,
    })
    @ApiOperation({ description: 'Resend verification code for user email' })
    resendVerificationEmail(@ObjectId() id: Types.ObjectId) {
        return this._UserService.resendVerificationEmail(id);
    }

    @Patch(':id')
    @ApiOperation({ description: 'Update user info by id' })
    @ApiBody({
        type: UpdateUserDto,
    })
    @ApiOkResponse({
        type: UserInfoDto,
    })
    updateUser(@ObjectId() id: Types.ObjectId, @Body() updateUserDto: UpdateUserDto) {
        return this._UserService.updateUser(id, updateUserDto);
    }

    @Delete(':id')
    @ApiOperation({ description: 'Delete user by id' })
    @ApiOkResponse({
        type: MessageResponseDto,
    })
    deleteUser(@ObjectId() id: Types.ObjectId) {
        return this._UserService.delete(id);
    }
}
