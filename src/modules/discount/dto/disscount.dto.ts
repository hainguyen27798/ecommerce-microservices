import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { DefaultDataDto } from '@/dto/core';
import { DiscountType } from '@/modules/discount/constants';
import { ApplyType } from '@/modules/discount/constants/apply-type';

@Exclude()
export class DiscountDto extends DefaultDataDto {
    @Expose()
    @ApiProperty()
    name: string;

    @Expose()
    @ApiProperty()
    code: string;

    @Expose()
    @ApiProperty()
    description: string;

    @Expose()
    @ApiProperty({ enum: DiscountType })
    type: string;

    @Expose()
    @ApiProperty()
    value: number;

    @Expose()
    @ApiProperty()
    isActive: boolean;

    @Expose()
    @ApiProperty({ enum: ApplyType })
    applyType: string;

    @Expose()
    @ApiProperty()
    maxSlots: number;

    @Expose()
    @ApiProperty({ type: Date })
    startDate: Date;

    @Expose()
    @ApiProperty({ type: Date })
    endDate: Date;
}
