import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsMongoId, ValidateNested } from 'class-validator';

import { CartProductDto } from '@/modules/cart/dto';

@Exclude()
export class CheckoutDto {
    @Expose()
    @ApiProperty()
    @IsMongoId()
    cartId: string;

    @Expose()
    @ApiProperty({ type: CartProductDto, isArray: true })
    @IsArray()
    @ArrayNotEmpty()
    @Type(() => CartProductDto)
    @ValidateNested({ each: true })
    cartProducts: CartProductDto[];
}
