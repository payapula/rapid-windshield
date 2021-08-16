import { Box, Container } from '@chakra-ui/react';
import React from 'react';

interface AdminLayoutLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutLayoutProps): JSX.Element {
    return (
        <Box>
            <Container maxW={{ base: '98%', lg: '80%' }} minH="100vh" p={10} border="1px">
                {children}
            </Container>
        </Box>
    );
}
