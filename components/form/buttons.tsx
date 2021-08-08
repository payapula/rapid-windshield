import { Button } from '@chakra-ui/react';
import React from 'react';

export const AddEditButton = ({ isEdit, children, ...props }) => (
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

export const DangerButton = ({ children, ...props }) => (
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
