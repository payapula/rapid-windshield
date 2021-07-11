import { Box, Container } from '@chakra-ui/react';
import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): JSX.Element {
    return (
        <Box>
            <Box color={['red', 'blue', 'green', 'yellow', 'orange', 'cyan', 'black']}>Sample</Box>
            <Container maxW="80%" minH="100vh">
                {children}
            </Container>
        </Box>
    );
}
