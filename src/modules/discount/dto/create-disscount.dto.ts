import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import {
    ArrayNotEmpty,
    IsArray,
    IsBoolean,
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Min,
    MinDate,
    ValidateIf,
} from 'class-validator';

import { DiscountType } from '@/modules/discount/constants';
import { ApplyType } from '@/modules/discount/constants/apply-type';
import { IsDateGreaterThan } from '@/validators';

@Exclude()
export class CreateDiscountDto {
    @Expose()
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @Expose()
    @ApiProperty()
    @IsString()
    @IsOptional()
    description: string;

    @Expose()
    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(DiscountType)
    type: string;

    @Expose()
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    value: number;

    @Expose()
    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    isActive: string;

    @Expose()
    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(ApplyType)
    applyType: string;

    @Expose()
    @ValidateIf((obj) => obj.applyType === ApplyType.SPECIFIC)
    @ApiProperty()
    @IsArray()
    @ArrayNotEmpty()
    specificToProduct: string[];

    @Expose()
    @ApiProperty()
    @IsNumber()
    @Min(1)
    maxSlots: number;

    @Expose()
    @ApiProperty()
    @IsNumber()
    @Min(1)
    maxSlotsPerUser: number;

    @Expose()
    @ApiProperty()
    @IsNumber()
    @IsOptional()
    minOrderValue: number;

    @Expose()
    @ApiProperty()
    @IsNotEmpty()
    @Transform(({ value }) => value && new Date(value))
    @IsDate()
    @MinDate(new Date())
    startDate: Date;

    @Expose()
    @ApiProperty()
    @IsNotEmpty()
    @Transform(({ value }) => value && new Date(value))
    @IsDate()
    @IsDateGreaterThan('startDate')
    endDate: Date;
}
