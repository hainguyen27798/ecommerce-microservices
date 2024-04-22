import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { IsStrongPassword, validate } from 'class-validator';
import _ from 'lodash';

import { HEADER_KEY } from '@/constants';

class PasswordDto {
    @IsStrongPassword()
    password: string;
}

export const NewPassword = createParamDecorator(async (_value: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const password = request.get(HEADER_KEY.NEW_PASSWORD);
    const passwordObject = plainToClass(PasswordDto, { password });
    const errors = await validate(passwordObject);

    if (errors.length) {
        throw new BadRequestException(_.get(errors, [0, 'constraints', 'isStrongPassword']));
    }

    return password;
});
