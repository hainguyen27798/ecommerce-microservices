import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { SuccessDto } from '@/dto/core';
import { UserService } from '@/modules/user/user.service';

export class ActiveUserCommand implements ICommand {
    constructor(
        public readonly verificationCode: string,
        public readonly newPassword: string,
    ) {}
}

@CommandHandler(ActiveUserCommand)
export class ActiveUserHandler implements ICommandHandler<ActiveUserCommand, SuccessDto> {
    constructor(private _UserService: UserService) {}

    execute(command: ActiveUserCommand) {
        return this._UserService.activeUser(command.verificationCode, command.newPassword);
    }
}
