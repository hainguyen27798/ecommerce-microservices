import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

import { CreateProductDto } from '@/modules/product/dto/create-product.dto';
import { ProductSubtypeRegistry } from '@/modules/product/dto/product-subtype-registry';

@Exclude()
export class UpdateProductDto extends PartialType(OmitType(CreateProductDto, ['type'])) {
    @Expose()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type((value) => ProductSubtypeRegistry[value.object.type])
    @ApiProperty()
    attributes: object;
}
