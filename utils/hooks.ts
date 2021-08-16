import { AlertStatus, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import RapidAnalytics from './analytics';

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

/**
 * Scenario: When the user navigates between pages, on client side transistions,
 * we need to log the page that user has visited. For this `routeChangeComplete` router event
 * is listened to.
 *
 * If the user directly enters a URL and navigates then `page_view` google event is logged along with
 * our custom `route_change_complete`
 */
export function useRapidAnalytics(): void {
    const router = useRouter();

    React.useEffect(() => {
        function onRouteChangeComplete(url) {
            // eslint-disable-next-line no-console
            console.log(`onRouteChangeComplete: Route is changing to ${url}`);
            RapidAnalytics.getInstance().logEvent('route_change_complete');
            if (url.includes('/admin')) {
                RapidAnalytics.getInstance().logEvent('admin_view');
            }
        }
        router.events.on('routeChangeComplete', onRouteChangeComplete);

        return () => {
            router.events.off('routeChangeComplete', onRouteChangeComplete);
        };
    }, []);
}
