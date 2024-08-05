import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
    ArrayNotEmpty,
    IsArray,
    IsEnum,
    IsMongoId,
    IsNotEmpty,
    IsNotEmptyObject,
    IsOptional,
    IsPhoneNumber,
    IsString,
    ValidateNested,
} from 'class-validator';

import { CartProductDto } from '@/modules/cart/dto';
import { PaymentMethod } from '@/modules/order/constants/payment-method';
import { PaymentStatus } from '@/modules/order/constants/payment-status';

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

@Exclude()
export class ShippingInfoDto {
    @Expose()
    @ApiProperty()
    @IsPhoneNumber()
    @IsNotEmpty()
    phone: string;

    @Expose()
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    country: string;

    @Expose()
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    province: string;

    @Expose()
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    district: string;

    @Expose()
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    commune: string;

    @Expose()
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    address: string;
}

@Exclude()
export class PaymentMethodDto {
    @Expose()
    @ApiProperty()
    @IsEnum(PaymentMethod)
    paymentMethod: string;

    @Expose()
    @ApiProperty()
    @IsEnum(PaymentStatus)
    paymentStatus: string;
}

@Exclude()
export class CheckoutCommitDto extends CheckoutDto {
    @Expose()
    @ApiProperty({ type: PaymentMethodDto })
    @IsNotEmptyObject()
    @Type(() => PaymentMethodDto)
    @ValidateNested({ always: true })
    paymentInfo: PaymentMethodDto;

    @Expose()
    @ApiProperty({ type: ShippingInfoDto })
    @Type(() => ShippingInfoDto)
    @IsNotEmptyObject()
    @ValidateNested({ always: true })
    shippingInfo: ShippingInfoDto;

    @Expose()
    @ApiProperty()
    @IsString()
    @IsOptional()
    note: string;
}
