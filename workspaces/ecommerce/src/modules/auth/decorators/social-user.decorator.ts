import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import _ from 'lodash';

import { SocialProviderList } from '@/modules/user/constants';
import { SocialUserInfoType } from '@/modules/user/types';

export const SocialUser = createParamDecorator((__, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.auth.payload;
    return {
        ...user,
        image: user.picture,
        provider: _.find(SocialProviderList, (provider) => _.includes(user.sub, provider)),
    } as SocialUserInfoType;
});
