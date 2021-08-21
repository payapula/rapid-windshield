import { Search2Icon, StarIcon, CloseIcon } from '@chakra-ui/icons';
import {
    InputGroup,
    InputLeftElement,
    Input,
    Stack,
    Text,
    Button,
    Box,
    Spinner,
    Flex,
    InputRightElement,
    Icon
} from '@chakra-ui/react';
import Layout from 'components/layout';
import { RestaurantCard } from 'components/restaurant-card';
import React from 'react';
import { ReactElement } from 'react';
import { useFirestore, useFirestoreCollectionData, useSigninCheck } from 'reactfire';
import { Restaurant } from 'types/restaurant';
import { isEmpty } from 'utils/utils';
import { Linkbutton } from 'components/link-button';
import { GrCheckbox, GrCheckboxSelected } from 'react-icons/gr';
import RapidAnalytics from 'utils/analytics';
import { debounce, filter } from 'lodash';
import { NextSeo } from 'next-seo';
import SignedInUser from 'components/admin/signed-in-user';
import 'firebase/firestore';

const debouncedLogEvent = debounce((query, result) => {
    RapidAnalytics.getInstance().logEvent('search_performed', {
        search_term: query,
        is_result_empty: result.length === 0
    });
}, 1000);

const isValidQuery = (query) => !isEmpty(query) && query.length > 2;

export const Index = (): JSX.Element => {
    const [query, setQuery] = React.useState('');
    const restaurantsCollection = useFirestore().collection('restaurants');
    const {
        data: restaurants,
        error,
        status
    } = useFirestoreCollectionData<Restaurant>(restaurantsCollection, { idField: 'id' });
    const [isAdmin, setAdmin] = React.useState(false);
    const [filteredResult, setFilteredResult] = React.useState<Restaurant[]>([]);

    React.useEffect(() => {
        if (!isValidQuery(query)) {
            return;
        }

        let filteredRestaurants;
        if (isAdmin) {
            filteredRestaurants = [...restaurants];
        } else {
            filteredRestaurants = filter(restaurants, (res) => res.enabled);
        }

        const result = filteredRestaurants.filter((res) => {
            return (
                res.name.toLowerCase().includes(query.toLowerCase()) ||
                res.location.toLowerCase().includes(query.toLowerCase())
            );
        });

        debouncedLogEvent(query, result);

        setFilteredResult(result);
    }, [query, isAdmin]);

    let restaurantsList: ReactElement = null;

    const dataDisplay = isValidQuery(query) ? filteredResult : restaurants;

    if (status === 'loading' || status === 'error') {
        if (status === 'error') {
            console.error(error);
        }

        restaurantsList = (
            <Text
                display="flex"
                h="90vh"
                alignItems="center"
                justifyContent="center"
                fontSize={{ base: '2xl', lg: 'lg' }}>
                {status === 'loading' ? 'Loading Restaurants' : 'Some Error Occured'}
            </Text>
        );
    } else {
        if (dataDisplay.length === 0) {
            restaurantsList = (
                <Text
                    display="flex"
                    h="90vh"
                    alignItems="center"
                    justifyContent="center"
                    fontSize={{ base: '2xl', lg: 'lg' }}>
                    No Restaurants Found!
                </Text>
            );
        } else {
            restaurantsList = (
                <>
                    <Text fontSize={{ base: 'lg', lg: '2xl' }} fontWeight="bold">
                        Your Favourites <StarIcon boxSize={5} color="yellow.600" />
                    </Text>
                    {dataDisplay.map((restaurant) => {
                        if (!isAdmin && !restaurant.enabled) {
                            return null;
                        }

                        return (
                            <Flex
                                key={restaurant.id}
                                direction="column"
                                opacity={restaurant.enabled ? '1' : '0.3'}>
                                {isAdmin && <EnableDisableRestaurant restaurant={restaurant} />}
                                <RestaurantCard
                                    name={restaurant.name}
                                    type={restaurant.type}
                                    location={restaurant.location}
                                    rating={restaurant.rating}
                                    imageUrl={restaurant.imageUrl}
                                    key={restaurant.id}
                                    id={restaurant.id}
                                />
                                {isAdmin && (
                                    <Flex direction="column">
                                        <Linkbutton
                                            href={`admin/editrestaurant/${encodeURIComponent(
                                                restaurant.id
                                            )}`}>
                                            Edit
                                        </Linkbutton>
                                    </Flex>
                                )}
                            </Flex>
                        );
                    })}
                </>
            );
        }
    }

    return (
        <Layout>
            <NextSeo title="Search Food and Restaurants" />
            <Stack mt="4">
                <SignUpLoginUI setAdmin={setAdmin} />
                <InputGroup alignItems="center">
                    <InputLeftElement pointerEvents="none" top="auto">
                        <Search2Icon w={5} h={5} color="gray.300" />
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
                    {query && (
                        <InputRightElement top="auto" mr="2" onClick={() => setQuery('')}>
                            <Button w={10} h={10} borderRadius="50%" background="gray.100">
                                <CloseIcon />
                            </Button>
                        </InputRightElement>
                    )}
                </InputGroup>
                {restaurantsList}
            </Stack>
        </Layout>
    );
};

interface EnableDisableRestaurantProps {
    restaurant: Restaurant;
}

const EnableDisableRestaurant = ({ restaurant }: EnableDisableRestaurantProps) => {
    const [enabled, setEnabled] = React.useState<boolean>(!!restaurant.enabled);
    const fireStore = useFirestore();

    React.useEffect(() => {
        async function updateRestaurant() {
            const editedData = {
                ...restaurant,
                enabled
            };

            await fireStore.collection('restaurants').doc(restaurant.id).set(editedData);
        }

        if (restaurant.enabled !== enabled) {
            updateRestaurant();
        }
    }, [enabled]);

    return (
        <Button
            onClick={() => {
                setEnabled((s) => !s);
            }}
            mt="1"
            mr="2"
            w={10}
            h={10}
            backgroundColor="transparent"
            borderRadius="50%">
            {enabled ? (
                <Icon as={GrCheckboxSelected} w={6} h={6} />
            ) : (
                <Icon as={GrCheckbox} w={6} h={6} />
            )}
        </Button>
    );
};

function SignUpLoginUI({ setAdmin }): ReactElement {
    const { status: signInStatus, data: signInCheckResult, error } = useSigninCheck();

    if (signInStatus === 'loading') {
        return <Spinner />;
    }

    if (signInStatus === 'error') {
        // Something happened to check for Admin Login
        RapidAnalytics.getInstance().logEvent('admin_error', {
            additionalInfo: 'Unable to check if User is signed in',
            error: JSON.stringify(error)
        });
        return null;
    }

    return <Box>{signInCheckResult.signedIn && <SignedInUser setAdmin={setAdmin} />}</Box>;
}

export default Index;
