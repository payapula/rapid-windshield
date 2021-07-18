import { Box, Flex, Text } from '@chakra-ui/react';
import { BrowseMenu } from 'components/restaurant-page/browse-menu';
import { RestaurantHeader, RestaurantInfo } from 'components/restaurant-page/header';
import { MenuPanel } from 'components/restaurant-page/menu-panel';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React from 'react';
import { RestaurantWithMenu } from 'types/restaurant';

// Server side Data Fetching
interface RestaurantPageProps {
    restaurant: RestaurantWithMenu;
}

const RestaurantFooter = () => {
    return (
        <Flex h="120px" p="2" justifyContent="center">
            <Text fontSize={{ base: 'md', lg: 'lg' }} opacity="0.8">
                FSSAI License Number: 123465498745654
            </Text>
        </Flex>
    );
};

export default function RestaurantPage({ restaurant }: RestaurantPageProps): JSX.Element {
    return (
        <Box className="restaurant-page">
            <Head>
                <title>{restaurant.name}</title>
            </Head>
            <Flex padding="4" background="#e5eef1" direction="column" minH="100vh">
                <Box background="white" padding="2.5" borderRadius="4px">
                    <RestaurantHeader />
                    <RestaurantInfo restaurant={restaurant} />
                </Box>
                <Box padding="2" minH="70vh">
                    <Text fontSize={{ base: '2xl', lg: 'xl' }} fontWeight="bold">
                        Menu
                    </Text>
                    <MenuPanel restaurant={restaurant} />
                </Box>
                <RestaurantFooter />
                <BrowseMenu restaurant={restaurant} />
            </Flex>
        </Box>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const response = await fetch(`http://localhost:3001/api/restaurants/${params.id}`);
    const data = await response.json();
    return {
        props: { restaurant: data.restaurant }
    };
};

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
