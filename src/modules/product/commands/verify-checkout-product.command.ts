import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { ClientSession } from 'mongoose';

import { ProductService } from '@/modules/product/product.service';
import { ProductDocument } from '@/modules/product/schemas/product.schema';
import { CheckoutProductType } from '@/modules/product/types';

export class VerifyCheckoutProductCommand implements ICommand {
    constructor(
        public readonly product: CheckoutProductType,
        public readonly session: ClientSession | null = null,
    ) {}
}

@CommandHandler(VerifyCheckoutProductCommand)
export class VerifyCheckoutProductHandler implements ICommandHandler<VerifyCheckoutProductCommand, ProductDocument> {
    constructor(private _ProductService: ProductService) {}

    async execute(command: VerifyCheckoutProductCommand) {
        return this._ProductService.verifyCheckoutProduct(command.product, command.session);
    }
}
