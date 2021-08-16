import { reduce } from 'lodash';
import { NextRouter } from 'next/router';
import { Dish, AdminCategory } from 'types/restaurant';

const navigateToCategoryView = (router: NextRouter, hashLink: string): void => {
    const urlWithouHash = router.asPath.split('#')[0];
    window.history.replaceState(null, '', `${urlWithouHash}#${hashLink}`);
    document.getElementById(hashLink).scrollIntoView({
        behavior: 'smooth'
    });
};

const arrangeDishesByCategory = (dishes: Dish[]): AdminCategory => {
    if (dishes === null) {
        return;
    }

    return reduce(
        dishes,
        function (categoryObj, dish) {
            return {
                ...categoryObj,
                [dish.category]: {
                    ...categoryObj[dish.category],
                    [dish.id]: dish
                }
            };
        },
        {}
    );
};

const escapeCategoryName = (categoryName: string): string =>
    categoryName.replace(/\s+/g, '-').toLowerCase();

export { navigateToCategoryView, arrangeDishesByCategory, escapeCategoryName };
