import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    HttpStatus,
    Injectable,
    Logger,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import _ from 'lodash';

import { SuccessDto } from '@/dto/core';
import { BcryptHelper } from '@/helpers';
import { AccountDto } from '@/modules/auth/dto';
import {
    ExtractTokenCommand,
    FindTokenCommand,
    GenerateTokenCommand,
    ProvideNewTokenCommand,
    RemoveTokenCommand,
    VerifyTokenCommand,
} from '@/modules/token/commands';
import { TokenDocument } from '@/modules/token/schemas/token.schema';
import { JwtPayload, PairSecretToken, PairSecretTokenType, RemoveTokenByType, TAuthUser } from '@/modules/token/types';
import { ActiveUserCommand, CreateUserCommand, FindUserByCommand } from '@/modules/user/commands';
import { UserRoles } from '@/modules/user/constants';
import { UserDocument } from '@/modules/user/schemas/user.schema';

@Injectable()
export class AuthService {
    constructor(private _CommandBus: CommandBus) {}

    async createNewAccount(accountDto: AccountDto) {
        await this._CommandBus.execute(new CreateUserCommand(accountDto));

        return new SuccessDto('create_account_successfully');
    }

    async validateUser(email: string, password: string): Promise<SuccessDto> {
        const currentAccount: UserDocument = await this.findUserByEmail(email);

        // Todo: it will be enable later
        // if (currentAccount.status !== UserStatus.ACTIVE) {
        //     throw new BadRequestException('account_is_inactivated_or_blocked');
        // }

        if (currentAccount) {
            if (await BcryptHelper.validatePassword(password, currentAccount.password)) {
                const payload: JwtPayload = {
                    name: currentAccount.name,
                    id: currentAccount._id.toString(),
                    role: currentAccount.role as UserRoles,
                    email: currentAccount.email,
                };

                // create jwt token
                const tokenObj: PairSecretToken = await this.generateToken(payload, true);

                if (tokenObj) {
                    return new SuccessDto('login_successfully', HttpStatus.OK, {
                        ...payload,
                        ...tokenObj,
                    });
                }
                throw new ConflictException('account_is_logged');
            }
        }
        throw new BadRequestException('email_or_password_is_incorrect');
    }

    private async findUserByEmail(email: string): Promise<UserDocument> {
        return this._CommandBus.execute(new FindUserByCommand({ email }));
    }

    async logout(refreshToken: string): Promise<SuccessDto> {
        const isSuccess: boolean = await this.removeToken('refreshToken', refreshToken);
        if (isSuccess) {
            return new SuccessDto('logout_successfully');
        }
        throw new BadRequestException('Invalid Token');
    }

    async handleRefreshToken(refreshToken: string): Promise<SuccessDto> {
        const userPayload: TAuthUser = await this.extractToken(refreshToken);

        if (!userPayload) {
            throw new BadRequestException('Invalid Token');
        }

        const token: TokenDocument = await this.findToken(userPayload.session);

        if (!token) {
            throw new BadRequestException('Invalid Token');
        }

        if (_.includes(token.refreshTokenUsed, refreshToken)) {
            // remove token
            await this.removeToken('session', token.session);
            throw new BadRequestException('Account was stolen');
        }

        if (token.refreshToken !== refreshToken) {
            throw new BadRequestException('Invalid Token');
        }

        try {
            await this.verifyToken(refreshToken);
            const tokenObj: PairSecretToken = await this.provideNewToken(
                {
                    name: userPayload.name,
                    id: userPayload.id,
                    email: userPayload.email,
                    role: userPayload.role,
                    session: userPayload.session,
                },
                refreshToken,
            );
            return new SuccessDto(null, HttpStatus.CREATED, tokenObj);
        } catch (e) {
            Logger.error(e.toString());
            // remove token
            await this.removeToken('session', token.session);
            throw new ForbiddenException('token_is_expired');
        }
    }

    activeAccount(verificationCode: string, newPassword: string) {
        return this._CommandBus.execute(new ActiveUserCommand(verificationCode, newPassword));
    }

    private async generateToken(payload: JwtPayload, createNew = false): Promise<PairSecretTokenType> {
        return this._CommandBus.execute(new GenerateTokenCommand(payload, createNew));
    }

    private async removeToken(by: RemoveTokenByType, value: string): Promise<boolean> {
        return this._CommandBus.execute(new RemoveTokenCommand(by, value));
    }

    private async findToken(session: string): Promise<TokenDocument> {
        return this._CommandBus.execute(new FindTokenCommand(session));
    }

    private async provideNewToken(payload: TAuthUser, oldRefreshToken: string): Promise<PairSecretToken> {
        return this._CommandBus.execute(new ProvideNewTokenCommand(payload, oldRefreshToken));
    }

    private async extractToken(token: string) {
        return this._CommandBus.execute(new ExtractTokenCommand(token));
    }

    private async verifyToken(token: string): Promise<JwtPayload> {
        return this._CommandBus.execute(new VerifyTokenCommand(token));
    }
}
