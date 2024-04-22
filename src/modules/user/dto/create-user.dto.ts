import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

import { UserMappingRoles } from '@/modules/user/constants';

@Exclude()
export class CreateUserDto {
    @Expose()
    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @Expose()
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    email: string;

    @Expose()
    @IsOptional()
    @IsEnum(UserMappingRoles, { message: 'role is invalid' })
    @ApiProperty()
    roleMapping: string;
}
