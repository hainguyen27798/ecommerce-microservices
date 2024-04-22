import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { UserDocument } from '@/modules/user/schemas/user.schema';
import { SocialUserInfoType } from '@/modules/user/types';
import { UserService } from '@/modules/user/user.service';

export class VerifyOrCreateSocialUserCommand implements ICommand {
    constructor(public readonly socialUser: SocialUserInfoType) {}
}

@CommandHandler(VerifyOrCreateSocialUserCommand)
export class VerifyOrCreateSocialUserHandler implements ICommandHandler<VerifyOrCreateSocialUserCommand, UserDocument> {
    constructor(private _UserService: UserService) {}

    execute(command: VerifyOrCreateSocialUserCommand) {
        return this._UserService.verifyOrCreateSocialUser(command.socialUser);
    }
}
