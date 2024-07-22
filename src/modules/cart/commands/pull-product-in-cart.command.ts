import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { ClientSession } from 'mongoose';

import { CartService } from '@/modules/cart/cart.service';
import { CartProductDto } from '@/modules/cart/dto';

export class PullProductInCartCommand implements ICommand {
    constructor(
        public readonly cartId: string,
        public readonly cartProduct: CartProductDto,
        public readonly session: ClientSession | null = null,
    ) {}
}

@CommandHandler(PullProductInCartCommand)
export class PullProductInCartHandler implements ICommandHandler<PullProductInCartCommand, boolean> {
    constructor(private _CartService: CartService) {}

    async execute(command: PullProductInCartCommand) {
        return this._CartService.pullProductToCart(command.cartId, command.cartProduct, command.session);
    }
}
