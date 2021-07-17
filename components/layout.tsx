import { Box, Container } from '@chakra-ui/react';
import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): JSX.Element {
    return (
        <Box>
            <Container maxW={{ base: '98%', lg: '80%' }} minH="100vh">
                {children}
            </Container>
        </Box>
    );
}
