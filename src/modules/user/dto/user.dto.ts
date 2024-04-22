import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { DefaultDataDto } from '@/dto/core';
import { UserStatus } from '@/modules/user/constants';

@Exclude()
export class UserDto extends DefaultDataDto {
    @Expose()
    @ApiProperty()
    email: string;

    @Expose()
    @ApiProperty()
    name: string;

    @Expose()
    @ApiProperty({ enum: UserStatus, default: UserStatus.ACTIVE })
    status: UserStatus;

    @Expose()
    @ApiProperty({ default: false })
    isSuperuser: boolean;

    @Expose()
    @ApiProperty({ default: false })
    isManager: boolean;
}
