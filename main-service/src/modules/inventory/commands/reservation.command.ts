import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { ClientSession } from 'mongoose';

import { InventoryService } from '@/modules/inventory/inventory.service';
import { ReservationRequestType } from '@/modules/inventory/types';

export class ReservationCommand implements ICommand {
    constructor(
        public readonly request: ReservationRequestType,
        public readonly session: ClientSession | null = null,
    ) {}
}

@CommandHandler(ReservationCommand)
export class ReservationHandler implements ICommandHandler<ReservationCommand, boolean> {
    constructor(private _InventoryService: InventoryService) {}

    execute(command: ReservationCommand) {
        return this._InventoryService.reservation(command.request, command.session);
    }
}
