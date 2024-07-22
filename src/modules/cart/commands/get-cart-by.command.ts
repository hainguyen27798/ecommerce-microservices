import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { CartService } from '@/modules/cart/cart.service';
import { CartDocument } from '@/modules/cart/schemas/cart.schema';

export class GetCartByCommands implements ICommand {
    constructor(
        public readonly cartId: string,
        public readonly userId: string,
    ) {}
}

@CommandHandler(GetCartByCommands)
export class GetCartByHandler implements ICommandHandler<GetCartByCommands, CartDocument> {
    constructor(private _CartService: CartService) {}

    async execute(command: GetCartByCommands): Promise<CartDocument> {
        return this._CartService.getCartBy(command.cartId, command.userId);
    }
}
