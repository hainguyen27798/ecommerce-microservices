import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { UserInfoType } from '@/modules/user/types';
import { UserService } from '@/modules/user/user.service';

export class CreateUserCommand implements ICommand {
    constructor(public readonly user: UserInfoType) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand, void> {
    constructor(private _UserService: UserService) {}

    execute(command: CreateUserCommand) {
        return this._UserService.createManualUser(command.user);
    }
}
