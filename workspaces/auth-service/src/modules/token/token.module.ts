import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import {
    ExtractTokenHandler,
    FindTokenHandler,
    GenerateTokenHandler,
    ProvideNewTokenHandler,
    RemoveTokenHandler,
    VerifyTokenHandler,
} from '@/modules/token/commands';
import { ClearTokenCron } from '@/modules/token/cron/clear-token.cron';
import { Token, TokenSchema } from '@/modules/token/schemas/token.schema';
import { JwtStrategy } from '@/modules/token/strategies/jwt.strategy';

import { TokenService } from './token.service';

const handlers = [
    GenerateTokenHandler,
    RemoveTokenHandler,
    ExtractTokenHandler,
    FindTokenHandler,
    ProvideNewTokenHandler,
    VerifyTokenHandler,
];

@Module({
    providers: [...handlers, TokenService, JwtStrategy, ClearTokenCron],
    imports: [
        MongooseModule.forFeature([
            {
                name: Token.name,
                schema: TokenSchema,
            },
        ]),
        JwtModule.register({}),
    ],
})
export class TokenModule {}
