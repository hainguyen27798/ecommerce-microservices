import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { SocialProvider } from '@/modules/user/constants';

@Exclude()
export class SocialTokenDto {
    @ApiProperty({ default: 'Social access Token' })
    @Expose()
    @IsString()
    @IsNotEmpty()
    accessToken: string;

    @ApiProperty({ default: 'Social jwt Token' })
    @Expose()
    @IsString()
    @IsNotEmpty()
    token: string;

    @ApiProperty({ type: 'enum', enum: SocialProvider, default: SocialProvider.GOOGLE })
    @IsNotEmpty()
    @IsEnum(SocialProvider)
    provider: string;
}
