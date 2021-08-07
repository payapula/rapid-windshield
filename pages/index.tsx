import { Search2Icon, StarIcon } from '@chakra-ui/icons';
import {
    InputGroup,
    InputLeftElement,
    Input,
    Stack,
    Text,
    Button,
    Box,
    Spinner,
    Flex
} from '@chakra-ui/react';
import Layout from 'components/layout';
import { RestaurantCard } from 'components/restaurant-card';
import Head from 'next/head';
import Link from 'next/link';
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
import { Linkbutton } from 'components/linkbutton';

declare global {
    interface Window {
        rapidadmin: boolean;
    }
}

export const Index = (): JSX.Element => {
    const [query, setQuery] = React.useState('');
    const restaurantsCollection = useFirestore().collection('restaurants');
    const {
        data: restaurants,
        error,
        status
    } = useFirestoreCollectionData<Restaurant>(restaurantsCollection, { idField: 'id' });
    const [isAdmin, setAdmin] = React.useState(false);

    let restaurantsList: ReactElement = null;

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
        restaurantsList = (
            <>
                <Text fontSize={{ base: 'lg', lg: '2xl' }} fontWeight="bold">
                    Your Favourites <StarIcon boxSize={5} color="yellow.600" />
                </Text>
                {restaurants.map((restaurant) => (
                    <RestaurantCard
                        name={restaurant.name}
                        type={restaurant.type}
                        location={restaurant.location}
                        rating={restaurant.rating}
                        imageUrl={restaurant.imageUrl}
                        key={restaurant.id}
                        id={restaurant.id}
                        isAdmin={isAdmin}
                    />
                ))}
            </>
        );
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
                {restaurantsList}
            </Stack>
        </Layout>
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
