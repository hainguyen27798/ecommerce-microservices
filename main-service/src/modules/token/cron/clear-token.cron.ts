import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { LoggerServerHelper } from '@/helpers';
import { TokenService } from '@/modules/token/token.service';

@Injectable()
export class ClearTokenCron {
    constructor(private readonly _TokenService: TokenService) {}

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async clearTokenDaily() {
        LoggerServerHelper.log('-------------------- Clear Token --------------------');
        await this._TokenService.clearTokens();
    }
}
