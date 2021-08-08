import { AlertStatus, useToast } from '@chakra-ui/react';
import React from 'react';

// CREDIT - chakra-ui James Au, Segun Adebayo
// https://github.com/chakra-ui/chakra-ui/blob/main/website/src/hooks/use-scrollspy.ts

export function useScrollSpy(selectors: string[], options?: IntersectionObserverInit): string {
    const [activeId, setActiveId] = React.useState<string>();
    const observer = React.useRef<IntersectionObserver>();
    React.useEffect(() => {
        const elements = selectors.map((selector) => document.querySelector(selector));
        if (observer.current) {
            observer.current.disconnect();
        }
        observer.current = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry?.isIntersecting) {
                    setActiveId(entry.target.getAttribute('id'));
                }
            });
        }, options);
        elements.forEach((el) => observer.current.observe(el));
        return () => observer.current.disconnect();
    }, [selectors]);

    return activeId;
}

type RapidToastProps = {
    status?: AlertStatus;
    // render?: ((props: RenderProps) => ReactNode);
    duration?: number;
    title: string;
    description?: string;
    isClosable?: boolean;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useRapidToast() {
    const toast = useToast();

    return ({
        status = 'success',
        duration = 5000,
        description,
        title,
        isClosable = true
    }: RapidToastProps) => {
        toast({
            position: 'top',
            status,
            duration,
            isClosable,
            title,
            description
        });
    };
}
