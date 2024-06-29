import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsMongoId, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

@Exclude()
export class DiscountProductDto {
    @Expose()
    @ApiProperty()
    @IsMongoId()
    id: string;

    @Expose()
    @ApiProperty()
    @IsNumber()
    quantity: number;
}

@Exclude()
export class DiscountAmountDto {
    @Expose()
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    discountCode: string;

    @Expose()
    @ApiProperty()
    @IsMongoId()
    shopId: string;

    @Expose()
    @ApiProperty({ type: DiscountProductDto, isArray: true })
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => DiscountProductDto)
    product: DiscountProductDto[];
}
