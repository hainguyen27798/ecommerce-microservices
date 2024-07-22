import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { DiscountService } from '@/modules/discount/discount.service';
import { CheckoutDiscountType, CheckoutTotalPriceType } from '@/modules/discount/types';

export class CheckoutDiscountCommand implements ICommand {
    constructor(
        public readonly userId: string,
        public readonly checkoutDiscount: CheckoutDiscountType,
    ) {}
}

@CommandHandler(CheckoutDiscountCommand)
export class CheckoutDiscountHandler implements ICommandHandler<CheckoutDiscountCommand, CheckoutTotalPriceType> {
    constructor(private readonly _DiscountService: DiscountService) {}

    async execute(command: CheckoutDiscountCommand) {
        return this._DiscountService.calculateDiscountAmount(command.userId, command.checkoutDiscount);
    }
}
