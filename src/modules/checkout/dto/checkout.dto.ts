import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsMongoId, IsOptional, IsString, ValidateNested } from 'class-validator';

import { CartProductDto } from '@/modules/cart/dto';

@Exclude()
export class DiscountApplyDto {
    @Expose()
    @ApiProperty()
    @IsMongoId()
    shop: string;

    @Expose()
    @ApiProperty()
    @IsString()
    code: string;
}

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

    @Expose()
    @ApiProperty({ type: DiscountApplyDto, isArray: true })
    @IsArray()
    @IsOptional()
    @Type(() => DiscountApplyDto)
    @ValidateNested({ each: true })
    discountApplies: DiscountApplyDto[];
}
