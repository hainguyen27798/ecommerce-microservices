import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { ProductService } from '@/modules/product/product.service';

export class CheckSpecificProductsCommand implements ICommand {
    constructor(
        public readonly shopId: string,
        public readonly productIds: string[],
    ) {}
}

@CommandHandler(CheckSpecificProductsCommand)
export class CheckSpecificProductsHandler implements ICommandHandler<CheckSpecificProductsCommand, boolean> {
    constructor(private _ProductService: ProductService) {}

    async execute(command: CheckSpecificProductsCommand): Promise<boolean> {
        return this._ProductService.checkSpecificProducts(command.shopId, command.productIds);
    }
}
