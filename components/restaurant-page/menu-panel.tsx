import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import { filter, map } from 'lodash';
import { useRouter } from 'next/router';
import React from 'react';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import { Dish, FOODLABEL, Items, Restaurant } from 'types/restaurant';
import {
    arrangeDishesByCategory,
    escapeCategoryName,
    navigateToCategoryView
} from 'utils/restaurant';
import { isEmpty } from 'utils/utils';
import { BrowseMenu } from './browse-menu';

const MenuPanel = ({ restaurant }: { restaurant: Restaurant }): JSX.Element => {
    const { id } = restaurant;

    const menuCollectionRef = useFirestore().collection('restaurants').doc(id).collection('menu');

    const { data: dishes, status: dishesStatus } = useFirestoreCollectionData<Dish>(
        menuCollectionRef,
        { idField: 'id' }
    );

    if (dishesStatus === 'loading' || dishesStatus === 'error') {
        return <Spinner />;
    }

    const categorizedDishes = arrangeDishesByCategory(dishes);

    if (isEmpty(categorizedDishes)) {
        return null;
    }

    return (
        <Flex direction="column">
            {map(categorizedDishes, (items, categoryKey) => (
                <CategoryPanel key={categoryKey} categoryName={categoryKey} items={items} />
            ))}
            <BrowseMenu categorizedDishes={categorizedDishes} />
        </Flex>
    );
};

interface CategoryPanelProps {
    categoryName: string;
    items: Items;
}

const CategoryPanel = ({ categoryName, items }: CategoryPanelProps) => {
    const hashLink = escapeCategoryName(categoryName);
    const router = useRouter();

    const onlyEnabledDishes = filter(items, (dish) => dish.enabled);

    return (
        <Flex
            key={categoryName}
            marginTop="5px"
            marginBottom="5px"
            direction="column"
            background="white"
            borderRadius="4px"
            padding="2">
            <h2
                id={hashLink}
                className="catergory-link-scroll-margin"
                onClick={() => {
                    navigateToCategoryView(router, hashLink);
                }}>
                <Text
                    flex="1"
                    textAlign="left"
                    fontWeight="extrabold"
                    color="pink.400"
                    fontSize={{ base: '2xl', lg: '3xl' }}>
                    {categoryName} ({onlyEnabledDishes.length})
                </Text>
            </h2>
            <Flex direction="column">
                {map(onlyEnabledDishes, (dish, index) => {
                    return (
                        <MenuCard
                            key={dish.id}
                            dish={dish}
                            isLast={onlyEnabledDishes.length - 1 === index}
                        />
                    );
                })}
            </Flex>
        </Flex>
    );
};

const MenuCard = ({
    dish,
    isLast,
    flexGrow = null
}: {
    dish: Dish;
    isLast: boolean;
    flexGrow?: number;
}): JSX.Element => {
    let label = 'VEG';
    switch (dish.label) {
        case FOODLABEL.NON_VEG:
            label = 'NON-VEG';
            break;
        case FOODLABEL.EGG:
            label = 'EGG';
            break;
    }

    return (
        <Flex
            alignItems="center"
            minH={{ base: '100px', lg: '120px' }}
            margin="8px 0 8px 0"
            justifyContent="space-between"
            borderBottom={isLast ? '0' : '1px'}
            borderStyle="dashed"
            flexGrow={flexGrow ? flexGrow : 0}>
            <Flex direction="column">
                <Text fontSize={{ base: 'sm', lg: 'md' }}>{label}</Text>
                <Text fontSize={{ base: 'xl', lg: '2xl' }} fontWeight="bold">
                    {dish.name}
                </Text>
                {dish.description && (
                    <Text fontSize={{ base: 'sm', lg: 'md' }} opacity="0.8">
                        {dish.description}
                    </Text>
                )}
            </Flex>
            <Box border="1px" borderColor="blue.100" borderRadius="4px" padding="1.5">
                <Text fontSize={{ base: 'xl', lg: '2xl' }}>Rs.{dish.price}</Text>
            </Box>
        </Flex>
    );
};

export { MenuPanel, MenuCard };
