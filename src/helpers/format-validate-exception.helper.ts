import { ValidationError } from 'class-validator';
import _ from 'lodash';

export const formatValidateExceptionHelper = (errors: ValidationError[]) => {
    return _.reduce(
        errors,
        (rs, error: ValidationError) => [
            ...rs,
            ...(error.children.length
                ? formatValidateExceptionHelper(error.children)
                : [...Object.values(error.constraints)]),
        ],
        [] as string[],
    );
};
