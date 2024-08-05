import { HttpStatus, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { SuccessDto } from '@/dto/core';
import { GenerateTokenCommand } from '@/modules/token/commands';
import { JwtPayload, PairSecretToken, PairSecretTokenType } from '@/modules/token/types';
import { VerifyOrCreateSocialUserCommand } from '@/modules/user/commands';
import { SocialProvider, UserRoles } from '@/modules/user/constants';
import { UserDocument } from '@/modules/user/schemas/user.schema';
import { SocialUserInfoType } from '@/modules/user/types';

@Injectable()
export class SocialAuthService {
    constructor(private readonly _CommandBus: CommandBus) {}

    async verifyLoginOrRegister(user: SocialUserInfoType) {
        const currentUser: UserDocument = await this._CommandBus.execute(new VerifyOrCreateSocialUserCommand(user));

        const payload: JwtPayload = {
            name: currentUser.name,
            id: currentUser._id.toString(),
            role: currentUser.role as UserRoles,
            email: currentUser.email,
            image: currentUser.image,
            provider: currentUser.socialProvider as SocialProvider,
        };

        // create jwt token
        const tokenObj: PairSecretToken = await this.generateToken(payload, true);

        if (tokenObj) {
            return new SuccessDto('login_successfully', HttpStatus.CREATED, {
                ...payload,
                ...tokenObj,
            });
        }
    }

    private async generateToken(payload: JwtPayload, createNew = false): Promise<PairSecretTokenType> {
        return this._CommandBus.execute(new GenerateTokenCommand(payload, createNew));
    }
}
