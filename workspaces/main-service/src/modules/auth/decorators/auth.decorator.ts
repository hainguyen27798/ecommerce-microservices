import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { PERMISSION_KEY } from '@/modules/auth/constants';
import { JwtGuard } from '@/modules/token/guards/jwt.guard';
import { UserRoles } from '@/modules/user/constants';

export const Auth = (...roles: UserRoles[]) =>
    applyDecorators(ApiBearerAuth(), SetMetadata(PERMISSION_KEY, roles), UseGuards(JwtGuard));
