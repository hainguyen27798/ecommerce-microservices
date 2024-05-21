import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { codeGeneratorHelper } from '@/helpers';
import { ApiPermissions } from '@/modules/api-key/constants';
import { ApiKey, ApiKeyDocument } from '@/modules/api-key/schemas/api-key.schema';

@Injectable()
export class ApiKeyService {
    constructor(@InjectModel(ApiKey.name) private readonly _ApiKeyModel: Model<ApiKey>) {}

    async findKey(key: string): Promise<ApiKeyDocument> {
        return this._ApiKeyModel.findOne({ key, status: true });
    }

    async create(permissions: ApiPermissions[]) {
        const key = codeGeneratorHelper();

        return this._ApiKeyModel.create({
            key,
            status: true,
            permissions,
        });
    }
}
