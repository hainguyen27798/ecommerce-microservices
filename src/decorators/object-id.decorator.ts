import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Types } from 'mongoose';

export const ObjectId = createParamDecorator((name = 'id', context: ExecutionContext): Types.ObjectId => {
    const request = context.switchToHttp().getRequest();

    const value = request.params[name];

    if (!Types.ObjectId.isValid(value)) {
        throw new BadRequestException('Invalid ObjectId');
    }

    return Types.ObjectId.createFromHexString(value);
});
