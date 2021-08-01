import { Button } from '@chakra-ui/react';
import Link from 'next/link';
import React, { Children } from 'react';

interface Props {
    href: string;
    children: React.ReactNode;
}

export const Linkbutton = ({ children, href }: Props) => {
    return (
        <Link href={href} passHref>
            <Button as="a">{children}</Button>
        </Link>
    );
};
