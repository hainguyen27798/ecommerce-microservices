import {
    registerDecorator,
    type ValidationArguments,
    type ValidationOptions,
    ValidatorConstraint,
    type ValidatorConstraintInterface,
} from 'class-validator';
import dayjs from 'dayjs';

@ValidatorConstraint({ name: 'IsDateGreaterThan' })
class IsDateGreaterThanConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        const [targetPropertyName] = args.constraints;
        const targetValue = args.object[targetPropertyName];
        return !!targetValue && dayjs(value).valueOf() > dayjs(targetValue).valueOf();
    }

    defaultMessage(args: ValidationArguments) {
        const [targetPropertyName] = args.constraints;
        return `${args.property} must be greater than ${targetPropertyName}`;
    }
}

export function IsDateGreaterThan(targetPropertyName: string, validationOptions?: ValidationOptions) {
    return function (value: any, propertyName: string) {
        return registerDecorator({
            target: value.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [targetPropertyName],
            validator: IsDateGreaterThanConstraint,
        });
    };
}
