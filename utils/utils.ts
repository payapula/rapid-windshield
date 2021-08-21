import { ValidatorReturnType } from './validations';

// https://stackoverflow.com/a/43233163
function isEmpty(value: unknown): boolean {
    return (
        value === undefined ||
        value === null ||
        (typeof value === 'object' && Object.keys(value).length === 0) ||
        (typeof value === 'string' && value.trim().length === 0)
    );
}

type ValidatorType = (value) => ValidatorReturnType;

const composeValidators =
    (...validators: ValidatorType[]) =>
    (value: unknown): unknown => {
        return validators.reduce((error, validator) => error || validator(value), undefined);
    };

const getBasePath = (url: string): string =>
    typeof window !== 'undefined'
        ? `${window.location.protocol}//${window.location.host}${url}`
        : url;

export { isEmpty, composeValidators, getBasePath };
