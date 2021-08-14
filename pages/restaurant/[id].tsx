import { Box, Flex, FormControl, FormLabel, Spinner, Switch, Text } from '@chakra-ui/react';
import { Linkbutton } from 'components/link-button';
import { RestaurantHeader, RestaurantInfo } from 'components/restaurant-page/header';
import { MenuPanel } from 'components/restaurant-page/menu-panel';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { useFirestore, useFirestoreDocData } from 'reactfire';
import { Restaurant } from 'types/restaurant';
import { isEmpty } from 'utils/utils';

// Server side Data Fetching
// interface RestaurantPageProps {
//     restaurant: RestaurantWithMenu;
// }

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const RestaurantFooter = () => {
    return (
        <Flex h="120px" p="2" justifyContent="center">
            <Text fontSize={{ base: 'md', lg: 'lg' }} opacity="0.8">
                FSSAI License Number: 123465498745654
            </Text>
        </Flex>
    );
};

export default function RestaurantPage(): JSX.Element {
    const router = useRouter();
    const { id } = router.query;
    const restaurantDocRef = useFirestore()
        .collection('restaurants')
        .doc(id as string);
    const { data: restaurant, status: restaurantStatus } = useFirestoreDocData<Restaurant>(
        restaurantDocRef,
        { idField: 'id' }
    );

    if (restaurantStatus === 'loading') {
        return <Spinner />;
    }

    if (restaurantStatus === 'error' || isEmpty(restaurant) || !restaurant.enabled) {
        return (
            <Box className="restaurant-page">
                <Head>
                    <title>Restaurant Not Found</title>
                </Head>
                <Flex padding="4" background="#e5eef1" direction="column" minH="100vh">
                    <Text
                        display="flex"
                        h="90vh"
                        alignItems="center"
                        justifyContent="center"
                        fontSize={{ base: '2xl', lg: 'lg' }}>
                        Oops! Restaurant is not found!
                    </Text>
                    <Linkbutton href="/" backgroundColor="pink.200">
                        Go Home
                    </Linkbutton>
                </Flex>
            </Box>
        );
    }

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
                <Box minH="70vh">
                    <Flex
                        background="white"
                        borderRadius="4px"
                        marginTop="10px"
                        marginBottom="5px"
                        padding="2">
                        <FormControl display="flex" alignItems="center">
                            <FormLabel htmlFor="veg-only" mb="0">
                                Veg Only
                            </FormLabel>
                            <Switch id="veg-only" size="md" colorScheme="green" />
                        </FormControl>
                        <Text marginLeft="auto" w="110px" fontSize={{ base: 'md', lg: 'lg' }}>
                            Best Safety
                        </Text>
                    </Flex>
                    <MenuPanel restaurant={restaurant} />
                </Box>
                {/* <RestaurantFooter /> */}
            </Flex>
        </Box>
    );
}

// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
//     const response = await fetch(`http://localhost:3001/api/restaurants/${params.id}`);
//     const data = await response.json();
//     return {
//         props: { restaurant: data.restaurant }
//     };
// };

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
