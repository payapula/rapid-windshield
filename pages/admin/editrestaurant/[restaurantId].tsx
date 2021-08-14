import { Heading, Spinner } from '@chakra-ui/react';
import AdminLayout from 'components/admin/admin.layout';
import { RestaurantTab } from 'components/admin/restaurant-tab';
import { Linkbutton } from 'components/link-button';
import { withAuthUser, AuthAction } from 'next-firebase-auth';
import { useRouter } from 'next/router';
import React from 'react';
import { useFirestore, useFirestoreCollectionData, useFirestoreDocData } from 'reactfire';
import { Dish, Restaurant } from 'types/restaurant';

const EditRestaurantPage = (): JSX.Element => {
    const router = useRouter();
    const { restaurantId } = router.query;
    const restaurantDocRef = useFirestore()
        .collection('restaurants')
        .doc(restaurantId as string);
    const { data: restaurant, status: restaurantStatus } = useFirestoreDocData<Restaurant>(
        restaurantDocRef,
        { idField: 'id' }
    );

    if (restaurantStatus === 'loading' || restaurantStatus === 'error') {
        return <Spinner />;
    }

    return <EditPanel restaurant={restaurant} />;
};

interface EditPanelProps {
    restaurant: Restaurant;
}

const EditPanel = ({ restaurant }: EditPanelProps) => {
    const menuCollectionRef = useFirestore()
        .collection('restaurants')
        .doc(restaurant.id)
        .collection('menu');

    const { data: dishes, status: dishesStatus } = useFirestoreCollectionData<Dish>(
        menuCollectionRef,
        { idField: 'id' }
    );

    if (dishesStatus === 'loading' || dishesStatus === 'error') {
        return <Spinner />;
    }

    return (
        <AdminLayout>
            {/* <pre>{JSON.stringify(dishes, null, 2)}</pre> */}
            <Linkbutton href="/">Go Home</Linkbutton>

            <Heading as="h1" textAlign="center">
                Edit Restaurant
            </Heading>
            <Heading textAlign="center" color="brown">
                {restaurant.name}
            </Heading>
            <RestaurantTab restaurant={restaurant} dishes={dishes} />
        </AdminLayout>
    );
};

export default withAuthUser({
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    LoaderComponent: Spinner
})(EditRestaurantPage);
