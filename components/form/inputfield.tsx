import { Field } from 'react-final-form';
import { Input } from '@chakra-ui/react';
import { ReactElement } from 'react';

const composeValidators =
    (...validators) =>
    (value) => {
        return validators.reduce((error, validator) => error || validator(value), undefined);
    };

interface InputFieldProps {
    name: string;
    placeHolder?: string;
    inputType?: 'number' | 'text' | 'url';
    validations?: unknown[];
}

const InputField = ({
    name,
    placeHolder,
    inputType = 'text',
    validations = null
}: InputFieldProps): ReactElement => {
    return (
        <Field
            name={name}
            validate={validations ? composeValidators(...validations) : undefined}
            render={({ input, meta }) => {
                return (
                    <>
                        <Input
                            {...input}
                            placeholder={placeHolder}
                            type={inputType}
                            isInvalid={meta.touched && meta.error}
                        />
                        {meta.error && meta.touched && <span>{meta.error}</span>}
                    </>
                );
            }}
        />
    );
};

export { InputField };
