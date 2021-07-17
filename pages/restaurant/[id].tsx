import { StarIcon } from '@chakra-ui/icons';
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Flex,
    Text
} from '@chakra-ui/react';
import Layout from 'components/layout';
import { GetServerSideProps } from 'next';
import React from 'react';
import { Dish, FOODLABEL, RestaurantWithMenu } from 'types/restaurant';

// - Client side rendering of data

// export default function RestaurantInfo(props): JSX.Element {
//     const [restaurant, setRestaurant] = React.useState<RestaurantWithMenu>(null);

//     React.useEffect(() => {
//         fetch(`/api/restaurants/${props.id}`)
//             .then((res) => res.json())
//             .then(
//                 (data) => {
//                     console.log(data.restaurant);
//                     setRestaurant(data.restaurant);
//                 },
//                 (error) => {
//                     // eslint-disable-next-line no-console
//                     console.log(error);
//                 }
//             );
//     }, []);

//     if (restaurant === null || restaurant === void 0) {
//         return <div>Loading...</div>;
//     }

//     return <div>viewing restaurant {restaurant.name}</div>;
// }

// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
//     return {
//         props: { id: params.id }
//     };
// };

// Server side Data Fetching
interface RestaurantInfoProps {
    restaurant: RestaurantWithMenu;
}

export default function RestaurantInfo({ restaurant }: RestaurantInfoProps): JSX.Element {
    return (
        <Layout>
            <Flex padding="4" direction="column" border="1px" borderStyle="solid" borderColor="red">
                <Box>
                    <Text fontSize={{ base: '3xl', lg: '2xl' }} fontWeight="bold">
                        {restaurant.name}
                    </Text>
                    <Text opacity="0.8" mt="2" fontSize={{ base: 'md', lg: 'xl' }}>
                        {restaurant.type}
                    </Text>
                    <Flex opacity="0.8">
                        <Text fontSize={{ base: 'md', lg: 'lg' }}>{restaurant.location}</Text>
                        <Box marginLeft="2" marginRight="2">
                            |
                        </Box>
                        <Flex
                            alignItems="center"
                            justifyContent="space-between"
                            w={{ base: '10', lg: '12' }}
                            fontSize={{ base: 'sm', lg: 'md' }}>
                            <StarIcon boxSize={3.5} /> {restaurant.rating}
                        </Flex>
                    </Flex>
                </Box>
                <Box>
                    <Text fontSize={{ base: '2xl', lg: 'xl' }} fontWeight="bold">
                        Menu
                    </Text>
                    <MenuAccordian restaurant={restaurant} />
                </Box>
            </Flex>
        </Layout>
    );
}

const MenuAccordian = ({ restaurant }: { restaurant: RestaurantWithMenu }) => {
    // console.log(restaurant);
    const { menu } = restaurant;

    if (menu === null || menu === void 0) {
        return null;
    }

    return (
        <Accordion defaultIndex={[0]} allowMultiple>
            {Object.entries(menu).map(([categoryName, menu]) => {
                return (
                    <AccordionItem key={categoryName}>
                        <h2>
                            <AccordionButton>
                                <Text flex="1" textAlign="left" fontWeight="bold">
                                    {categoryName}
                                </Text>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                            {menu.map((dish) => {
                                return <MenuCard key={dish.id} dish={dish} />;
                            })}
                        </AccordionPanel>
                    </AccordionItem>
                );
            })}
        </Accordion>
    );
};

const MenuCard = ({ dish }: { dish: Dish }) => {
    return (
        <Flex
            border="1px"
            borderStyle="dashed"
            borderColor="red"
            alignItems="center"
            justifyContent="space-between">
            <Flex direction="column">
                <Text fontSize={{ base: 'sm', lg: 'md' }}>
                    {dish.status === FOODLABEL.VEG ? 'VEG' : 'NON VEGETARIAN'}
                </Text>
                <Text fontSize={{ base: 'xl', lg: '2xl' }}>{dish.name}</Text>
            </Flex>
            <Text fontSize={{ base: 'xl', lg: '2xl' }}>Rs.{dish.price}</Text>
        </Flex>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const response = await fetch(`http://localhost:3001/api/restaurants/${params.id}`);
    const data = await response.json();
    return {
        props: { restaurant: data.restaurant }
    };
};
