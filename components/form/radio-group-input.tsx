import { Field } from 'react-final-form';
import {
    ChakraProps,
    ComponentWithAs,
    FormControl,
    FormLabel,
    MergeWithAs,
    Radio,
    RadioGroup,
    RadioProps
} from '@chakra-ui/react';
import React, { ReactElement } from 'react';
import { required } from 'utils/validations';

export interface RadioGroupInputProps extends ChakraProps {
    name: string;
    labelText?: string;
    isRequired?: boolean;
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

const RadioGroupInput = ({
    name,
    labelText,
    isRequired = false,
    size = 'md',
    children,
    ...props
}: RadioGroupInputProps): ReactElement => {
    const mergeValidations = isRequired ? required : undefined;

    return (
        <Field
            name={name}
            validate={mergeValidations}
            render={({ input, meta }) => {
                const [value, setValue] = React.useState<string>(input.value);
                return (
                    <FormControl isRequired={isRequired} {...props}>
                        <FormLabel htmlFor={name} color="pink.600" fontSize="xl">
                            {labelText}
                        </FormLabel>
                        <RadioGroup
                            onChange={(value) => {
                                setValue(value);
                                input.onChange(value);
                            }}
                            value={value}
                            size={size}>
                            {children}
                        </RadioGroup>
                        {meta.error && meta.touched && <span>{meta.error}</span>}
                    </FormControl>
                );
            }}
        />
    );
};

interface RapidRadioProps {
    value: string;
    children: React.ReactNode;
}

const RapidRadio: ComponentWithAs<'input', MergeWithAs<RadioProps, RapidRadioProps>> = ({
    value,
    children
}) => {
    return <Radio value={value}>{children}</Radio>;
};

export { RadioGroupInput, RapidRadio };
