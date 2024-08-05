import _ from 'lodash';

import { ProductAttributeType } from '@/modules/product/types';

export class TransformProductAttributes {
    static arrayToObject(attrs: ProductAttributeType[]) {
        return _.reduce(attrs, (rs: object, attr: ProductAttributeType) => ({ ...rs, [attr.key]: attr.value }), {});
    }

    static objectToArray(object: object): ProductAttributeType[] {
        return _.map(_.keys(object), (key) => ({
            key,
            value: object[key],
        }));
    }
}
