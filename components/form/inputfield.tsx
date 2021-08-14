import { Field } from 'react-final-form';
import { ChakraProps, FormControl, FormLabel, Input, Textarea } from '@chakra-ui/react';
import React, { ReactElement } from 'react';
import { required } from 'utils/validations';
import { composeValidators } from 'utils/utils';

export interface InputFieldProps extends ChakraProps {
    name: string;
    placeHolder?: string;
    inputType?: 'number' | 'text' | 'url' | 'password' | 'textarea';
    validations?: unknown[];
    labelText?: string;
    isRequired?: boolean;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'outline' | 'unstyled' | 'filled' | 'flushed';
    maxLength?: number;
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
        ref: React.MutableRefObject<HTMLInputElement | HTMLTextAreaElement>
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
                    const { maxLength, ...otherProps } = props;
                    return (
                        <FormControl isRequired={isRequired} {...otherProps}>
                            <FormLabel htmlFor={name} color="pink.600" fontSize="xl">
                                {labelText || placeHolder}
                            </FormLabel>
                            {inputType === 'textarea' ? (
                                <Textarea
                                    {...input}
                                    id={name}
                                    placeholder={placeHolder}
                                    type={inputType}
                                    isInvalid={meta.touched && meta.error}
                                    ref={ref as React.MutableRefObject<HTMLTextAreaElement>}
                                    autoComplete="off"
                                    size={size}
                                    variant={variant}
                                    resize="vertical"
                                    maxLength={maxLength}
                                />
                            ) : (
                                <Input
                                    {...input}
                                    id={name}
                                    placeholder={placeHolder}
                                    type={inputType}
                                    isInvalid={meta.touched && meta.error}
                                    ref={ref as React.MutableRefObject<HTMLInputElement>}
                                    autoComplete="off"
                                    size={size}
                                    variant={variant}
                                    maxLength={maxLength}
                                />
                            )}
                            {meta.error && meta.touched && <span>{meta.error}</span>}
                        </FormControl>
                    );
                }}
            />
        );
    }
);

export { InputField };
