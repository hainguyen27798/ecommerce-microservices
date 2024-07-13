import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsMongoId, IsNumber, Min, ValidateNested } from 'class-validator';

@Exclude()
export class CartProductDto {
    @Expose()
    @ApiProperty()
    @IsMongoId()
    product: string;

    @Expose()
    @ApiProperty()
    @IsMongoId()
    shop: string;

    @Expose()
    @ApiProperty()
    @IsNumber()
    @Min(1)
    quantity: number;
}

@Exclude()
export class CreateCartDto {
    @Expose()
    @ApiProperty({ type: CartProductDto, isArray: true })
    @IsArray()
    @ArrayNotEmpty()
    @Type(() => CartProductDto)
    @ValidateNested({ each: true })
    cartProducts: CartProductDto[];
}
