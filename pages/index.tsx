import { Search2Icon, StarIcon } from '@chakra-ui/icons';
import { InputGroup, InputLeftElement, Input, Stack, Flex, Text, Box } from '@chakra-ui/react';
import Layout from 'components/layout';
import Head from 'next/head';
import React from 'react';
import Image from 'next/image';
import { Restaurant } from 'types/restaurant';
import { useRouter } from 'next/router';

const imageSize = '150';

export function RestaurantCard(props: Restaurant): JSX.Element {
    const router = useRouter();
    const { name, location, type, rating, imageUrl, id } = props;
    return (
        <Flex
            w="100%"
            h="180px"
            border="1px"
            borderColor="gray.300"
            borderRadius="4px"
            alignItems="center"
            padding="2"
            onClick={() => {
                router.push(`restaurant/${id}`);
            }}
            boxShadow="sm">
            <Image src={imageUrl} width={imageSize} height={imageSize} alt="Food Pic" />
            <Flex direction="column" ml="6" flexGrow={2}>
                <Box borderBottom="1px" borderStyle="dashed" paddingBottom="5px">
                    <Text as="div" fontSize="2xl" fontWeight="bold">
                        {name}
                    </Text>
                    <Text as="div" opacity="0.8" mt="2">
                        {type}
                    </Text>
                    <Flex opacity="0.8">
                        <Box>{location}</Box>
                        <Box marginLeft="2" marginRight="2">
                            |
                        </Box>
                        <Flex alignItems="center" justifyContent="space-between" w="12">
                            <StarIcon boxSize={3.5} /> {rating}
                        </Flex>
                    </Flex>
                </Box>
            </Flex>
        </Flex>
    );
}

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

                <Text fontSize="2xl" fontWeight="bold">
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
            </Stack>
        </Layout>
    );
};

export default Index;
