import { SocialProvider, UserRoles } from '@/modules/user/constants';

export type UserInfoType = {
    name: string;
    email: string;
    password: string;
    roleMapping?: UserRoles;
};

export type SocialUserInfoType = Omit<UserInfo, 'password' | 'role'> & {
    provider: SocialProvider;
    image: string;
};
