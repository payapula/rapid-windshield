export type ValidatorReturnType = string | undefined;

export const required = (value: string): ValidatorReturnType => (value ? undefined : 'Required');
export const mustBeNumber = (value: unknown): ValidatorReturnType =>
    isNaN(value as number) ? 'Must be a number' : undefined;
export const minValue =
    (min: number) =>
    (value: number): ValidatorReturnType =>
        isNaN(value) || value >= min ? undefined : `Should be greater than ${min}`;
export const maxValue =
    (max: number) =>
    (value: number): ValidatorReturnType =>
        isNaN(value) || value <= max ? undefined : `Should be less than ${max}`;
