import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

import { ProductTypes } from '@/modules/product/constants';
import { ProductSubtypeRegistry } from '@/modules/product/dto/product-subtype-registry';

@Exclude()
export class CreateProductDto {
    @Expose()
    @IsString()
    @ApiProperty()
    name: string;

    @Expose()
    @IsString()
    @IsOptional()
    @ApiProperty()
    image: string;

    @Expose()
    @IsNumber()
    @ApiProperty()
    price: number;

    @Expose()
    @IsNumber()
    @ApiProperty()
    quantity: number;

    @Expose()
    @IsEnum(ProductTypes)
    @ApiProperty({ enum: ProductTypes })
    type: ProductTypes;

    @Expose()
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type((value) => ProductSubtypeRegistry[value.object.type])
    @ApiProperty()
    attributes: object;
}
