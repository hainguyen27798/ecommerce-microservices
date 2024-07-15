import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { ProductService } from '@/modules/product/product.service';
import { ProductDocument } from '@/modules/product/schemas/product.schema';
import { CheckoutProductType } from '@/modules/product/types';

export class VerifyCheckoutProductsCommand implements ICommand {
    constructor(public readonly products: CheckoutProductType[]) {}
}

@CommandHandler(VerifyCheckoutProductsCommand)
export class VerifyCheckoutProductsHandler
    implements ICommandHandler<VerifyCheckoutProductsCommand, ProductDocument[]>
{
    constructor(private _ProductService: ProductService) {}

    async execute(command: VerifyCheckoutProductsCommand) {
        return this._ProductService.verifyCheckoutProducts(command.products);
    }
}
