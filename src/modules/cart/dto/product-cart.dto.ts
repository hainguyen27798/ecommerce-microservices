import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, plainToClass, Transform } from 'class-transformer';

import { DefaultDataDto } from '@/dto/core';
import { ProductDto } from '@/modules/product/dto/product.dto';

@Exclude()
export class ProductCartDto extends DefaultDataDto {
    @Expose()
    @ApiProperty()
    @Transform((value) =>
        plainToClass(ProductDto, value.obj.product, {
            excludeExtraneousValues: true,
        }),
    )
    productInfo: ProductDto;

    @Expose()
    @ApiProperty()
    quantity: number;
}
