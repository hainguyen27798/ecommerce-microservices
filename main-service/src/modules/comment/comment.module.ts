import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Comment, CommentSchema } from '@/modules/comment/schemas/comment.schema';

import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
    controllers: [CommentController],
    imports: [
        MongooseModule.forFeature([
            {
                name: Comment.name,
                schema: CommentSchema,
            },
        ]),
    ],
    providers: [CommentService],
})
export class CommentModule {}
