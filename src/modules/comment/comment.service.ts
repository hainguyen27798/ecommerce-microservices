import { BadRequestException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

import { SuccessDto } from '@/dto/core';
import { toObjectId } from '@/helpers';
import { CommentDto, CreateCommentDto } from '@/modules/comment/dto';
import { Comment } from '@/modules/comment/schemas/comment.schema';

@Injectable()
export class CommentService {
    constructor(
        @InjectModel(Comment.name) private readonly _CommentModel: Model<Comment>,
        @InjectConnection() private readonly _Connection: Connection,
    ) {}

    async createComment(userId: string, data: CreateCommentDto) {
        let left: number;
        let right: number;
        const parentId = data.replyTo ? toObjectId(data.replyTo) : null;

        const session = await this._Connection.startSession();

        try {
            session.startTransaction();
            Logger.debug('Comment Transaction - Start');

            if (parentId) {
                const maxCommentRight = await this._CommentModel.findOne(
                    {
                        product: data.product,
                        _id: parentId,
                    },
                    'right',
                    {
                        sort: { right: -1 },
                        session,
                    },
                );

                await this._CommentModel.updateMany(
                    {
                        product: data.product,
                        left: { $gte: maxCommentRight.right },
                    },
                    {
                        $inc: {
                            left: 2,
                        },
                    },
                    {
                        session,
                    },
                );

                await this._CommentModel.updateMany(
                    {
                        product: data.product,
                        right: { $gte: maxCommentRight.right },
                    },
                    {
                        $inc: {
                            right: 2,
                        },
                    },
                    {
                        session,
                    },
                );

                left = maxCommentRight ? maxCommentRight.right : 1;
                right = left + 1;
            } else {
                const maxCommentRight = await this._CommentModel.findOne(
                    {
                        product: data.product,
                    },
                    'right',
                    {
                        sort: { right: -1 },
                        session,
                    },
                );

                left = maxCommentRight ? maxCommentRight.right + 1 : 1;
                right = left + 1;
            }

            const newComment = await this._CommentModel.create(
                [
                    {
                        product: data.product,
                        user: userId,
                        content: data.content,
                        parentId,
                        left,
                        right,
                    },
                ],
                {
                    session,
                },
            );

            await session.commitTransaction();
            Logger.debug('Comment Transaction - Commit');

            return new SuccessDto('Create new comment', HttpStatus.CREATED, newComment?.[0], CommentDto);
        } catch (_e) {
            await session.abortTransaction();
            Logger.debug(`Comment Transaction - Rollback (reason: ${_e.message})`);
            throw new BadRequestException('Could not create comment');
        } finally {
            await session.endSession();
            Logger.debug('Comment Transaction - End');
        }
    }
}
