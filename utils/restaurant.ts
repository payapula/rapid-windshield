import { NextRouter } from 'next/router';

const navigateToCategoryView = (router: NextRouter, hashLink: string): void => {
    const urlWithouHash = router.asPath.split('#')[0];
    window.history.replaceState(null, '', `${urlWithouHash}#${hashLink}`);
    document.getElementById(hashLink).scrollIntoView({
        behavior: 'smooth'
    });
};

export { navigateToCategoryView };
