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
import Head from 'next/head';
import React from 'react';
import { ReactElement } from 'react';
import {
    useAuth,
    useFirestore,
    useFirestoreCollectionData,
    useFirestoreDocDataOnce,
    useSigninCheck,
    useUser
} from 'reactfire';
import { Restaurant } from 'types/restaurant';
import 'firebase/auth';
import { RapidFireUser } from 'types/user';
import { isEmpty } from 'utils/utils';
import { Linkbutton } from 'components/link-button';
import { GrCheckbox, GrCheckboxSelected } from 'react-icons/gr';
import RapidAnalytics from 'utils/analytics';
import { debounce, filter } from 'lodash';

const debouncedLogEvent = debounce((query, result) => {
    RapidAnalytics.getInstance().logEvent('search_performed', {
        searchterm: query,
        isResultEmpty: result.length === 0
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

    const shouldDisplaySignInControls = true; //typeof window !== 'undefined' && window.sessionStorage.getItem('rapidadmin');

    return (
        <Layout>
            <Head>
                <title>Search Food/Restaurants</title>
            </Head>
            <Stack mt="4">
                {shouldDisplaySignInControls && <SignUpLoginUI setAdmin={setAdmin} />}
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
    const { status: signInStatus, data: signInCheckResult } = useSigninCheck();

    if (signInStatus === 'loading' || signInStatus === 'error') {
        return <Spinner />;
    }

    return <Box>{signInCheckResult.signedIn && <SignedInUser setAdmin={setAdmin} />}</Box>;
}

const SignedInUser = ({ setAdmin }) => {
    const auth = useAuth();

    const user = useUser();

    if (isEmpty(user)) {
        return null;
    }

    const docRef = useFirestore().collection('users').doc(user.data.uid);
    const { status, data } = useFirestoreDocDataOnce<RapidFireUser>(docRef);

    React.useEffect(() => {
        if (data?.role === 'Admin') {
            setAdmin(true);
        } else {
            setAdmin(false);
        }
    }, [data]);

    if (status === 'loading' || status === 'error') {
        return <Spinner />;
    }

    const isAdmin = data?.role === 'Admin';

    return (
        <Flex>
            <Button
                onClick={() => {
                    setAdmin(false);
                    auth.signOut();
                }}>
                Logout
            </Button>
            {isAdmin && <Linkbutton href="admin/addrestaurant">Add New Restaurant</Linkbutton>}
        </Flex>
    );
};

export default Index;
