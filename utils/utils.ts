// https://stackoverflow.com/a/43233163
function isEmpty(value: unknown): boolean {
    return (
        value === undefined ||
        value === null ||
        (typeof value === 'object' && Object.keys(value).length === 0) ||
        (typeof value === 'string' && value.trim().length === 0)
    );
}

const composeValidators =
    (...validators) =>
    (value) => {
        return validators.reduce((error, validator) => error || validator(value), undefined);
    };

export { isEmpty, composeValidators };
