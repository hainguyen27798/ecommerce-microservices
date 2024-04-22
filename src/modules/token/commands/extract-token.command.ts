import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { TokenService } from '@/modules/token/token.service';
import { TAuthUser } from '@/modules/token/types';

export class ExtractTokenCommand implements ICommand {
    constructor(public readonly token: string) {}
}

@CommandHandler(ExtractTokenCommand)
export class ExtractTokenHandler implements ICommandHandler<ExtractTokenCommand, TAuthUser> {
    constructor(private _TokenService: TokenService) {}

    async execute(command: ExtractTokenCommand): Promise<TAuthUser> {
        return this._TokenService.extractToken(command.token);
    }
}
