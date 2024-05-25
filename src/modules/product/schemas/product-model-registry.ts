import { Connection } from 'mongoose';

import { SchemaRegistry } from '@/modules/product/schemas/product-schema-registry';

export const PRODUCT_MODELS = 'productModels';

export const ProductModelRegistry = (conn: Connection) => {
    return SchemaRegistry.reduce((rs, schema) => {
        return {
            ...rs,
            [schema.name]: conn.model(schema.name, schema.schema),
        };
    }, {});
};
