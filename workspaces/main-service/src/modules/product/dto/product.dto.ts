import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';

import { DefaultDataDto } from '@/dto/core';
import { ProductTypes } from '@/modules/product/constants';
import { TransformProductAttributes } from '@/modules/product/helpers';
import { UserDto } from '@/modules/user/dto';

@Exclude()
export class ProductDto extends DefaultDataDto {
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
    type: string;

    @Expose()
    @ApiProperty({ type: UserDto })
    @Transform((value) => value.obj.shop?.toString() || value.obj.shop)
    shop: UserDto;

    @Transform((value) => TransformProductAttributes.arrayToObject(value.obj.attributes))
    @Expose()
    @ApiProperty({ type: Object })
    attributes: object[];
}
