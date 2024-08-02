import { Body, Controller, Delete, Post } from '@nestjs/common';

import { ObjectId } from '@/decorators';
import { Auth } from '@/modules/auth/decorators';
import { AuthUser } from '@/modules/auth/decorators/auth-user.decorator';
import { CommentService } from '@/modules/comment/comment.service';
import { CreateCommentDto } from '@/modules/comment/dto';
import { TAuthUser } from '@/modules/token/types';
import { UserRoles } from '@/modules/user/constants';

@Controller('comments')
export class CommentController {
    constructor(private readonly _CommentService: CommentService) {}

    @Auth(UserRoles.USER, UserRoles.SHOP)
    @Post()
    createComment(@AuthUser() user: TAuthUser, @Body() data: CreateCommentDto) {
        return this._CommentService.createComment(user.id, data);
    }

    @Auth(UserRoles.USER, UserRoles.SHOP)
    @Delete(':productId/:commentId')
    deleteComment(
        @AuthUser() user: TAuthUser,
        @ObjectId('productId') productId: string,
        @ObjectId('commentId') commentId: string,
    ) {
        return this._CommentService.deleteComment(user.id, productId, commentId);
    }
}
