import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PassportModule } from '@nestjs/passport';

import { LocalAuthStrategy } from '@/modules/auth/strategies/local-auth.strategy';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SocialAuthController } from './social-auth.controller';
import { SocialAuthService } from './social-auth.service';
import { SocialAuthVerificationService } from './social-auth-verification.service';

@Module({
    providers: [AuthService, LocalAuthStrategy, SocialAuthService, SocialAuthVerificationService],
    controllers: [AuthController, SocialAuthController],
    imports: [PassportModule, CqrsModule],
})
export class AuthModule {}
