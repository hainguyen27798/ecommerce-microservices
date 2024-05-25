import { ModelDefinition } from '@nestjs/mongoose';

import { Clothing, ClothingSchema } from '@/modules/product/schemas/clothing.schema';
import { Electronic, ElectronicSchema } from '@/modules/product/schemas/electronic.schema';

export const SchemaRegistry: ModelDefinition[] = [
    { name: Clothing.name, schema: ClothingSchema },
    { name: Electronic.name, schema: ElectronicSchema },
];
