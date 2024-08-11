import { FilterQuery } from 'mongoose';

export type FilterQueryType<Entity> = FilterQuery<Partial<Entity>>;
