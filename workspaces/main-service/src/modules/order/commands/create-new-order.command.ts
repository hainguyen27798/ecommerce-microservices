import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { ClientSession } from 'mongoose';

import { OrderService } from '@/modules/order/order.service';
import { OrderDocument } from '@/modules/order/schemas/order.schema';
import { NewOrderType } from '@/modules/order/types';

export class CreateNewOrderCommand implements ICommand {
    constructor(
        public readonly newOrder: NewOrderType,
        public readonly session: ClientSession | null = null,
    ) {}
}

@CommandHandler(CreateNewOrderCommand)
export class CreateNewOrderHandler implements ICommandHandler<CreateNewOrderCommand, OrderDocument> {
    constructor(private readonly _OrderService: OrderService) {}

    async execute(command: CreateNewOrderCommand) {
        return this._OrderService.createNew(command.newOrder, command.session);
    }
}
