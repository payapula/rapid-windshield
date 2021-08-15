/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { InputField, InputFieldProps } from 'components/form/inputfield';
import React from 'react';

export const ManageRestaurantInput = React.forwardRef(
    (props: InputFieldProps, ref: React.MutableRefObject<HTMLInputElement>): JSX.Element => {
        return <InputField {...props} mt={5} mb={5} size="lg" ref={ref} />;
    }
);
