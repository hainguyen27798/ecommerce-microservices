import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { HEADER_KEY } from '@/constants';

export const VerificationCode = createParamDecorator(async (_value: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.get(HEADER_KEY.VERIFICATION_CODE);
});
