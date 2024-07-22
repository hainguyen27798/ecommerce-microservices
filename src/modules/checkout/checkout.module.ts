import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';

@Module({
    providers: [CheckoutService],
    imports: [CqrsModule],
    controllers: [CheckoutController],
})
export class CheckoutModule {}
