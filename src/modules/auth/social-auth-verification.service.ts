import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { auth } from 'express-oauth2-jwt-bearer';
import { promisify } from 'util';

import { Configuration } from '@/config/configuration';

@Injectable()
export class SocialAuthVerificationService {
    auth0Handler: (req: Request, res: Response) => Promise<any>;

    constructor() {
        this.auth0Handler = promisify(auth(Configuration.instance.auth0Config));
    }

    async authenticate(req: Request, res: Response) {
        return await this.auth0Handler(req, res);
    }
}
