import { UserDocument } from '@/modules/user/schemas/user.schema';
import { FilterQueryType } from '@/types';

export type FilterUserType = FilterQueryType<UserDocument>;
