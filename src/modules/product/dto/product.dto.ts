import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { ProductTypes } from '@/modules/product/constants';

@Exclude()
export class ProductDto {
    @Expose()
    @ApiProperty()
    name: string;

    @Expose()
    @ApiProperty()
    image: string;

    @Expose()
    @ApiProperty()
    description: string;

    @Expose()
    @ApiProperty()
    price: number;

    @Expose()
    @ApiProperty()
    slug: string;

    @Expose()
    @ApiProperty({ default: 4.5 })
    rating: number;

    @Expose()
    @ApiProperty()
    quantity: number;

    @Expose()
    @ApiProperty({ enum: ProductTypes })
    type: ProductTypes;

    @Expose()
    @ApiProperty({ type: Object })
    attributes: object;
}
