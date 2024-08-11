import { ExecutionContext, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import _ from 'lodash';

import { PERMISSION_KEY } from '@/modules/auth/constants';
import { UserRoles } from '@/modules/user/constants';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
    constructor(private _Reflector: Reflector) {
        super();
    }

    handleRequest(err: any, user: any, _info: any, context: ExecutionContext) {
        // get roles required
        const roles = this._Reflector.getAllAndOverride<UserRoles>(PERMISSION_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        const hasPermission = _.includes(roles, user?.role);

        Logger.log(`Current role: ${user.role}`);
        Logger.log(`Required roles: ${roles}`);

        if (!hasPermission) {
            throw err || new ForbiddenException();
        }
        return user;
    }
}
