import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';

import { DefaultDataDto } from '@/dto/core';
import { ProductDto } from '@/modules/product/dto/product.dto';

@Exclude()
export class CartDto extends DefaultDataDto {
    @Expose()
    @ApiProperty()
    @Transform((value) => value.obj.user)
    userId: string;

    @Expose()
    @ApiProperty()
    @Transform((value) => value.obj.cartProducts)
    products: ProductDto[];
}
