import { Exclude, Expose } from 'class-transformer';

import { DefaultDataDto } from '@/dto/core';
import { UserStatus } from '@/modules/user/constants';

@Exclude()
export class UserDto extends DefaultDataDto {
    @Expose()
    email: string;

    @Expose()
    name: string;

    @Expose()
    status: UserStatus;

    @Expose()
    isManager: boolean;

    @Expose()
    isSuperuser: boolean;
}
