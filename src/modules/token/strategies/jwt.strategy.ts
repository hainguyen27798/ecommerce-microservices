import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { TokenDocument } from '@/modules/token/schemas/token.schema';
import { TokenService } from '@/modules/token/token.service';
import { TAuthUser } from '@/modules/token/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private _TokenService: TokenService) {
        super(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKeyProvider: async (
                    _request: Request,
                    rawJwtToken: string,
                    done: (err: any, secretOrKey?: string | Buffer) => void,
                ) => {
                    const userPayload: TAuthUser = this._TokenService.extractToken(rawJwtToken);
                    if (userPayload) {
                        const token: TokenDocument = await this._TokenService.findToken(userPayload.session);
                        if (token) {
                            done(null, token.privateKey);
                        } else {
                            done('invalid_token');
                        }
                    } else {
                        done('invalid_token');
                    }
                },
            },
            (payload: any, done: any) => {
                done(null, payload);
            },
        );
    }

    async validate(payload: any) {
        return payload;
    }
}
