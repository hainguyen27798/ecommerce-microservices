import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { InventoryService } from '@/modules/inventory/inventory.service';
import { InventoryType } from '@/modules/inventory/types';

export class CreateInventoryCommand implements ICommand {
    constructor(public readonly inventory: InventoryType) {}
}

@CommandHandler(CreateInventoryCommand)
export class CreateInventoryHandler implements ICommandHandler<CreateInventoryCommand, void> {
    constructor(private _InventoryService: InventoryService) {}

    execute(command: CreateInventoryCommand) {
        return this._InventoryService.create(command.inventory);
    }
}
