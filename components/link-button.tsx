import { Button, ButtonProps, ComponentWithAs, MergeWithAs } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';

interface LinkbuttonProps {
    href: string;
    children: React.ReactNode;
}

export const Linkbutton: ComponentWithAs<'button', MergeWithAs<ButtonProps, LinkbuttonProps>> = ({
    children,
    href,
    ...props
}) => {
    return (
        <Link href={href} passHref>
            <Button as="a" {...props}>
                {children}
            </Button>
        </Link>
    );
};
