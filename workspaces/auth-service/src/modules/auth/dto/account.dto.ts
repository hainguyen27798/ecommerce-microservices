import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsStrongPassword } from 'class-validator';

import { RequestUserDto } from '@/modules/user/dto';

@Exclude()
export class AccountDto extends RequestUserDto {
    @ApiProperty({ default: 'Strong password' })
    @Expose()
    @IsStrongPassword({ minLength: 8 })
    password: string;
}
