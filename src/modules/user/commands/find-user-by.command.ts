import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { Types } from 'mongoose';

import { UserDocument } from '@/modules/user/schemas/user.schema';
import { FilterUserType } from '@/modules/user/types';
import { UserService } from '@/modules/user/user.service';

export class FindUserByCommand implements ICommand {
    constructor(public readonly query: FilterUserType) {}
}

@CommandHandler(FindUserByCommand)
export class FindUserByHandler implements ICommandHandler<FindUserByCommand, UserDocument> {
    constructor(private _UserService: UserService) {}

    execute(command: FindUserByCommand): Promise<UserDocument> {
        const query = command.query;
        if (query.id) {
            query.id = Types.ObjectId.createFromHexString(query.id);
        }
        return this._UserService.findUserBy(query);
    }
}
