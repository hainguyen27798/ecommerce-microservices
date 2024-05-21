import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { every, includes } from 'lodash';

import { HEADER_KEY } from '@/constants';
import { ApiKeyService } from '@/modules/api-key/api-key.service';
import { ALLOW_API_KEYS, ApiPermissions } from '@/modules/api-key/constants';

@Injectable()
export class ApiKeyGuard implements CanActivate {
    constructor(
        private readonly _ApiKeyService: ApiKeyService,
        private _Reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const allowApiKeys = this._Reflector.getAllAndOverride<ApiPermissions[]>(ALLOW_API_KEYS, [
            context.getHandler(),
            context.getClass(),
        ]);
        const request = context.switchToHttp().getRequest<Request>();
        const key = request.headers[HEADER_KEY.API_KEY] as string;

        if (!key) {
            throw new ForbiddenException('forbidden_api_key');
        }

        const apiKey = await this._ApiKeyService.findKey(key);

        if (!apiKey) {
            throw new ForbiddenException('forbidden_api_key');
        }

        return every(allowApiKeys, (permission) => includes(apiKey.permissions, permission));
    }
}
