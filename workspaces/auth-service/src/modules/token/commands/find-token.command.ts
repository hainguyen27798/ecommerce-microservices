import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { TokenDocument } from '@/modules/token/schemas/token.schema';
import { TokenService } from '@/modules/token/token.service';

export class FindTokenCommand implements ICommand {
    constructor(public readonly session: string) {}
}

@CommandHandler(FindTokenCommand)
export class FindTokenHandler implements ICommandHandler<FindTokenCommand, TokenDocument> {
    constructor(private _TokenService: TokenService) {}

    execute(command: FindTokenCommand): Promise<TokenDocument> {
        return this._TokenService.findToken(command.session);
    }
}
