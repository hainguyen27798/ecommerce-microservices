import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import crypto from 'crypto';
import dayjs from 'dayjs';
import { DurationUnitType } from 'dayjs/plugin/duration';
import _ from 'lodash';
import { Model } from 'mongoose';

import { TokenExpires } from '@/modules/token/constants';
import { Token, TokenDocument } from '@/modules/token/schemas/token.schema';
import {
    JwtPayload,
    PairKey,
    PairSecretToken,
    PairSecretTokenType,
    RemoveTokenByType,
    TAuthUser,
    TToken,
} from '@/modules/token/types';

@Injectable()
export class TokenService {
    constructor(
        @InjectModel(Token.name) private _TokenModel: Model<Token>,
        private _JwtService: JwtService,
    ) {}

    async generateToken(payload: JwtPayload, createNew = false): Promise<PairSecretTokenType> {
        // create pair key
        const { privateKey, publicKey }: PairKey = this.createSecretPairKey();
        const tokenPayload: TAuthUser = {
            ...payload,
            session: this.createSession(),
        };

        // create pair jwt token
        const accessToken: string = this.createJwtToken(tokenPayload, privateKey, TokenExpires.ACCESS_TOKEN);
        const refreshToken: string = this.createJwtToken(tokenPayload, publicKey, TokenExpires.REFRESH_TOKEN);

        // update refresh token
        await this.saveToken(
            {
                user: payload.id,
                privateKey,
                publicKey,
                refreshToken: refreshToken,
                session: tokenPayload.session,
            },
            createNew,
        );

        return { refreshToken, accessToken };
    }

    private async saveToken(token: TToken, createNew = false): Promise<TokenDocument> {
        const { user, ...obj } = token;

        if (createNew) {
            return this._TokenModel.create(token);
        }

        return this._TokenModel.findOneAndUpdate({ user }, obj, { upsert: true, new: true }).lean();
    }

    private createJwtToken(payload: JwtPayload, secretKey: string, expiresIn: string) {
        return this._JwtService.sign(payload, {
            // algorithm: 'RS256',
            expiresIn,
            privateKey: secretKey,
        });
    }

    private createSession(): string {
        return crypto.randomBytes(32).toString('hex');
    }

    private createSecretPairKey(): PairKey {
        return {
            privateKey: crypto.randomBytes(64).toString('hex'),
            publicKey: crypto.randomBytes(64).toString('hex'),
        };
    }

    async findToken(session: string): Promise<TokenDocument> {
        return this._TokenModel.findOne({ session }).exec();
    }

    async removeToken(by: RemoveTokenByType, value: string): Promise<boolean> {
        const tokenData: TokenDocument = await this._TokenModel.findOneAndDelete({ [by]: value }).lean();

        return !!tokenData;
    }

    extractToken(token: string): TAuthUser {
        return this._JwtService.decode(token) as TAuthUser;
    }

    async provideNewToken(payload: TAuthUser, oldRefreshToken: string): Promise<PairSecretToken> {
        // create new pair key
        const { privateKey, publicKey }: PairKey = this.createSecretPairKey();

        // create new pair jwt token
        const accessToken: string = this.createJwtToken(payload, privateKey, TokenExpires.ACCESS_TOKEN);
        const refreshToken: string = this.createJwtToken(payload, publicKey, TokenExpires.REFRESH_TOKEN);

        // update token
        await this._TokenModel.updateOne(
            { session: payload.session },
            {
                $set: { refreshToken, privateKey, publicKey },
                $push: { refreshTokenUsed: oldRefreshToken },
            },
        );

        return { refreshToken, accessToken };
    }

    async verifyToken(token: string, secretKey: string): Promise<JwtPayload> {
        return this._JwtService.verify(token, {
            secret: secretKey,
        });
    }

    async clearTokens() {
        const regex = /^(\d+)([a-z]+)$/i;
        const matches = TokenExpires.REFRESH_TOKEN.match(regex);
        const amount = _.get(matches, 1);
        const unit = _.get(matches, 2) as DurationUnitType;

        const duration = dayjs.duration(_.toNumber(amount), unit);
        const time = dayjs().subtract(duration).toDate();
        await this._TokenModel.deleteMany({
            updatedAt: {
                $lt: time,
            },
        });
    }
}
