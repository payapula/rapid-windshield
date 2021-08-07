import { Field } from 'react-final-form';
import { ChakraProps, FormControl, FormLabel, Input } from '@chakra-ui/react';
import React, { ReactElement } from 'react';
import { required } from 'utils/validations';

const composeValidators =
    (...validators) =>
    (value) => {
        return validators.reduce((error, validator) => error || validator(value), undefined);
    };

interface InputFieldProps extends ChakraProps {
    name: string;
    placeHolder?: string;
    inputType?: 'number' | 'text' | 'url' | 'password';
    validations?: unknown[];
    labelText?: string;
    isRequired?: boolean;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'outline' | 'unstyled' | 'filled' | 'flushed';
}

const InputField = React.forwardRef(
    (
        {
            name,
            placeHolder,
            inputType = 'text',
            validations = null,
            labelText,
            isRequired = false,
            size = 'md',
            variant = 'flushed',
            ...props
        }: InputFieldProps,
        ref: React.MutableRefObject<HTMLInputElement>
    ): ReactElement => {
        const mergeValidations = validations
            ? composeValidators(isRequired ? required : undefined, ...validations)
            : isRequired
            ? required
            : undefined;

        return (
            <Field
                name={name}
                validate={mergeValidations}
                render={({ input, meta }) => {
                    return (
                        <FormControl isRequired={isRequired} {...props}>
                            <FormLabel htmlFor={name} color="pink.600" fontSize="xl">
                                {labelText || placeHolder}
                            </FormLabel>
                            <Input
                                {...input}
                                id={name}
                                placeholder={placeHolder}
                                type={inputType}
                                isInvalid={meta.touched && meta.error}
                                ref={ref}
                                autoComplete="off"
                                size={size}
                                variant={variant}
                            />
                            {meta.error && meta.touched && <span>{meta.error}</span>}
                        </FormControl>
                    );
                }}
            />
        );
    }
);

export { InputField };
