import { Box, Flex, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { Dish, FOODLABEL, RestaurantWithMenu } from 'types/restaurant';
import { navigateToCategoryView } from 'utils/restaurant';
import { isEmpty } from 'utils/utils';

const MenuPanel = ({ restaurant }: { restaurant: RestaurantWithMenu }): JSX.Element => {
    const { menu } = restaurant;

    if (isEmpty(menu)) {
        return null;
    }

    return (
        <Flex direction="column" marginLeft="-1" marginRight="-1">
            {Object.entries(menu).map(([categoryName, menu]) => (
                <CategoryPanel key={categoryName} categoryName={categoryName} menu={menu} />
            ))}
        </Flex>
    );
};

interface CategoryPanelProps {
    categoryName: string;
    menu: Dish[];
}

const CategoryPanel = ({ categoryName, menu }: CategoryPanelProps) => {
    const hashLink = categoryName.replace(/\s+/g, '-').toLowerCase();
    const router = useRouter();

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
                    fontSize={{ base: '2xl', lg: 'xl' }}>
                    {categoryName} ({menu.length})
                </Text>
            </h2>
            <Flex direction="column">
                {menu.map((dish, index) => {
                    return (
                        <MenuCard key={dish.id} dish={dish} isLast={menu.length - 1 === index} />
                    );
                })}
            </Flex>
        </Flex>
    );
};

const MenuCard = ({ dish, isLast }: { dish: Dish; isLast: boolean }) => {
    return (
        <Flex
            alignItems="center"
            minH={{ base: '100px', lg: '120px' }}
            margin="8px 0 8px 0"
            justifyContent="space-between"
            borderBottom={isLast ? '0' : '1px'}
            borderStyle="dashed">
            <Flex direction="column">
                <Text fontSize={{ base: 'sm', lg: 'md' }}>
                    {dish.status === FOODLABEL.VEG ? 'VEG' : 'NON-VEG'}
                </Text>
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

export { MenuPanel };
