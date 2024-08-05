import _ from 'lodash';

export enum SocialProvider {
    GOOGLE = 'google',
    LINKEDIN = 'linkedin',
}

export const SocialProviderList = _.values(SocialProvider);
