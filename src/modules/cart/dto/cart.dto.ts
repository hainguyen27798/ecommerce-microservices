import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, plainToInstance, Transform } from 'class-transformer';

import { DefaultDataDto } from '@/dto/core';
import { ProductCartDto } from '@/modules/cart/dto/product-cart.dto';

@Exclude()
export class CartDto extends DefaultDataDto {
    @Expose()
    @ApiProperty()
    @Transform((value) => plainToInstance(ProductCartDto, value.obj.cartProducts))
    cartDetails: ProductCartDto[];
}
