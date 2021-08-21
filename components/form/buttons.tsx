import { Button } from '@chakra-ui/react';
import React from 'react';

interface AddEditButtonProps {
    isEdit: boolean;
    children: React.ReactNode;
}

export const AddEditButton = ({ isEdit, children, ...props }: AddEditButtonProps): JSX.Element => (
    <Button
        backgroundColor={isEdit ? 'yellow.300' : 'facebook.400'}
        color={isEdit ? 'black' : 'white'}
        _hover={{
            backgroundColor: isEdit ? 'yellow.500' : 'facebook.800'
        }}
        {...props}>
        {children}
    </Button>
);

interface DangerButtonProps {
    children: React.ReactNode;
}

export const DangerButton = ({ children = null, ...props }: DangerButtonProps): JSX.Element => (
    <Button
        color="white"
        backgroundColor="red.300"
        _hover={{
            backgroundColor: 'red.800'
        }}
        {...props}>
        {children}
    </Button>
);
