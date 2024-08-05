import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import mongoose, { ClientSession } from 'mongoose';

import { InventoryService } from '@/modules/inventory/inventory.service';

export class DeleteInventoryCommand implements ICommand {
    constructor(
        public readonly productId: mongoose.Types.ObjectId,
        public readonly shopId: mongoose.Types.ObjectId,
        public readonly session: ClientSession | null = null,
    ) {}
}

@CommandHandler(DeleteInventoryCommand)
export class DeleteInventoryHandler implements ICommandHandler<DeleteInventoryCommand, void> {
    constructor(private _InventoryService: InventoryService) {}

    execute(command: DeleteInventoryCommand) {
        return this._InventoryService.delete(command.productId, command.shopId, command.session);
    }
}
