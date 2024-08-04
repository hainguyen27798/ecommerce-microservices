import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';

import { SocialAuthVerificationService } from '@/modules/auth/social-auth-verification.service';

@Injectable()
export class SocialTokenVerificationGuard implements CanActivate {
    constructor(private readonly _SocialAuthVerificationService: SocialAuthVerificationService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const response = context.switchToHttp().getResponse<Response>();

        try {
            await this._SocialAuthVerificationService.authenticate(request, response);
        } catch (e) {
            throw new BadRequestException(e.message);
        }

        return true;
    }
}
