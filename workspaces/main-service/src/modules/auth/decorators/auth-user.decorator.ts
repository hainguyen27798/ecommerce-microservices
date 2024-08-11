import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { TAuthUser } from '@/modules/token/types';

export const AuthUser = createParamDecorator((_data: unknown, context: ExecutionContext): TAuthUser => {
    const request = context.switchToHttp().getRequest();
    return request.user;
});
