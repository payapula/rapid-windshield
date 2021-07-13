import { Search2Icon, StarIcon } from '@chakra-ui/icons';
import { InputGroup, InputLeftElement, Input, Stack, Text } from '@chakra-ui/react';
import Layout from 'components/layout';
import { RestaurantCard } from 'components/restaurant-card';
import Head from 'next/head';
import React from 'react';
import { Restaurant } from 'types/restaurant';

export const Index = (): JSX.Element => {
    const [query, setQuery] = React.useState('');
    const [restaurants, setRestaurants] = React.useState<Restaurant[]>([]);
    const [filteredResult, setFilteredResult] = React.useState<Restaurant[]>([]);

    React.useEffect(() => {
        fetch('/api/restaurants')
            .then((res) => res.json())
            .then(
                (data) => setRestaurants(data),
                (error) => {
                    // eslint-disable-next-line no-console
                    console.log(error);
                }
            );
    }, []);

    React.useEffect(() => {
        if (!query) {
            return;
        }
        const filteredRestaurants = [...restaurants];
        const result = filteredRestaurants.filter((res) => {
            return (
                res.name.toLowerCase().includes(query.toLowerCase()) ||
                res.location.toLowerCase().includes(query.toLowerCase())
            );
        });
        setFilteredResult(result);
    }, [query]);

    const dataDisplay = query ? filteredResult : restaurants;

    return (
        <Layout>
            <Head>
                <title>Search Food/Restaurants</title>
            </Head>
            <Stack mt="4">
                <InputGroup alignItems="center">
                    <InputLeftElement pointerEvents="none" top="auto">
                        <Search2Icon color="gray.300" />
                    </InputLeftElement>
                    <Input
                        type="text"
                        placeholder="Search for restaurants or food or location"
                        height="50px"
                        size="lg"
                        focusBorderColor="pink.400"
                        borderColor="pink.200"
                        boxShadow="md"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </InputGroup>

                {dataDisplay.length === 0 ? (
                    <Text
                        display="flex"
                        h="90vh"
                        alignItems="center"
                        justifyContent="center"
                        fontSize={{ base: '2xl', lg: 'lg' }}>
                        No Restaurants Found!
                    </Text>
                ) : (
                    <>
                        <Text fontSize={{ base: 'lg', lg: '2xl' }} fontWeight="bold">
                            Your Favourites <StarIcon boxSize={5} color="yellow.600" />
                        </Text>
                        {dataDisplay.map((restaurant) => (
                            <RestaurantCard
                                name={restaurant.name}
                                type={restaurant.type}
                                location={restaurant.location}
                                rating={restaurant.rating}
                                imageUrl={restaurant.imageUrl}
                                key={restaurant.id}
                                id={restaurant.id}
                            />
                        ))}
                    </>
                )}
            </Stack>
        </Layout>
    );
};

export default Index;
