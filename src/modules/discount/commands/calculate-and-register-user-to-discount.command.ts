import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { ClientSession } from 'mongoose';

import { DiscountService } from '@/modules/discount/discount.service';
import { CheckoutDiscountType, CheckoutTotalPriceType } from '@/modules/discount/types';

export class CalculateAndRegisterUserToDiscountCommand implements ICommand {
    constructor(
        public readonly userId: string,
        public readonly checkoutDiscount: CheckoutDiscountType,
        public readonly session: ClientSession | null = null,
    ) {}
}

@CommandHandler(CalculateAndRegisterUserToDiscountCommand)
export class CalculateAndRegisterUserToDiscountHandler
    implements ICommandHandler<CalculateAndRegisterUserToDiscountCommand, CheckoutTotalPriceType>
{
    constructor(private readonly _DiscountService: DiscountService) {}

    async execute(command: CalculateAndRegisterUserToDiscountCommand) {
        return this._DiscountService.calculateAndRegisterUserToDiscount(
            command.userId,
            command.checkoutDiscount,
            command.session,
        );
    }
}
