import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';

import { DefaultDataDto } from '@/dto/core';
import { UserDto } from '@/modules/user/dto';

@Exclude()
export class CommentDto extends DefaultDataDto {
    @Expose()
    @ApiProperty()
    product: string;

    @Expose()
    @ApiProperty()
    content: string;

    @Expose()
    @ApiProperty()
    @Type(() => UserDto)
    user: UserDto;

    @Expose()
    @ApiProperty()
    @Transform((value) => value.obj.parentId)
    replyTo: string;
}
