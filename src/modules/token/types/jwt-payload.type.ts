import { SocialProvider, UserRoles } from '@/modules/user/constants';

export type JwtPayload = {
    name: string;
    id: string;
    role: UserRoles;
    email: string;
    provider?: SocialProvider;
    image?: string;
};

export type TAuthUser = JwtPayload & {
    session: string;
};
