import { Body, Controller, Delete, Patch, Post, Put } from '@nestjs/common';
import { Types } from 'mongoose';

import { ObjectId } from '@/decorators';
import { RequestUserDto } from '@/modules/user/dto';
import { UpdateUserDto } from '@/modules/user/dto/update-user.dto';
import { UserService } from '@/modules/user/user.service';

@Controller()
export class UserController {
    constructor(private _UserService: UserService) {}

    @Post('request')
    requestUser(@Body() requestUserDto: RequestUserDto) {
        return this._UserService.requestUser(requestUserDto);
    }

    @Put('approve/:id')
    approveUser(@ObjectId() id: Types.ObjectId) {
        return this._UserService.approveUser(id);
    }

    @Put('resend/:id')
    resendVerificationEmail(@ObjectId() id: Types.ObjectId) {
        return this._UserService.resendVerificationEmail(id);
    }

    @Patch(':id')
    updateUser(@ObjectId() id: Types.ObjectId, @Body() updateUserDto: UpdateUserDto) {
        return this._UserService.updateUser(id, updateUserDto);
    }

    @Delete(':id')
    deleteUser(@ObjectId() id: Types.ObjectId) {
        return this._UserService.delete(id);
    }
}
