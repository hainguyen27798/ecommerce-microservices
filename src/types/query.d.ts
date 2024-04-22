export type Query<Entity> = {
    [key in keyof Entity]: Entity[key] | any;
};

export type FilterQueryType<Entity> = Query<Partial<Entity>>;
