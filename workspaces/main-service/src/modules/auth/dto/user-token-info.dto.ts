import { ApiProperty } from '@nestjs/swagger';

import { SocialProvider, UserMappingRoles } from '@/modules/user/constants';

export class TokenInfoDto {
    @ApiProperty({ default: 'JWT Token' })
    refreshToken: string;

    @ApiProperty({ default: 'JWT Token' })
    accessToken: string;
}

export class UserTokenInfoDto extends TokenInfoDto {
    @ApiProperty({ default: 'ObjectId' })
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty({ enum: UserMappingRoles, default: UserMappingRoles.USER })
    role: string;

    @ApiProperty({ default: 'email@example.com' })
    email: string;
}

export class SocialUserTokenInfoDto extends UserTokenInfoDto {
    @ApiProperty({ enum: SocialProvider, default: SocialProvider.GOOGLE })
    provider: string;
}
