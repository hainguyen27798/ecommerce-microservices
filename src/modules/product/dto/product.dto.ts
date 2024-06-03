import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';

import { DefaultDataDto } from '@/dto/core';
import { ProductTypes } from '@/modules/product/constants';
import { UserDto } from '@/modules/user/dto';

interface Attributes {
    key: string;
    value: string;
}

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
    shop: UserDto;

    @Transform((value) => {
        return value.obj.attributes.reduce((rs: object, attr: Attributes) => ({ ...rs, [attr.key]: attr.value }), {});
    })
    @Expose()
    @ApiProperty({ type: Object })
    attributes: object[];
}
