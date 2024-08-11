import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

import { HEADER_KEY } from '@/constants';
import { ALLOW_API_KEYS, ApiPermissions } from '@/modules/api-key/constants';
import { ApiKeyGuard } from '@/modules/api-key/guards/api-key.guard';

export const ApiKey = (...permissions: ApiPermissions[]) =>
    applyDecorators(
        ApiHeader({ name: HEADER_KEY.API_KEY, example: 'api key' }),
        SetMetadata(ALLOW_API_KEYS, permissions),
        UseGuards(ApiKeyGuard),
    );
