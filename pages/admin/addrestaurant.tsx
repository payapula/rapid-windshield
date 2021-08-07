import { Heading, Spinner } from '@chakra-ui/react';
import AdminLayout from 'components/admin/admin.layout';
import { Linkbutton } from 'components/linkbutton';
import React from 'react';
import { RestaurantTab } from 'components/admin/restauranttab';
import { AuthAction, withAuthUser } from 'next-firebase-auth';

const AddRestaurantPage = (): JSX.Element => {
    return (
        <AdminLayout>
            <Linkbutton href="/">Go Home</Linkbutton>
            <Heading as="h1" textAlign="center">
                Add Restaurant
            </Heading>
            <RestaurantTab />
        </AdminLayout>
    );
};

// export default AddRestaurantPage;

export default withAuthUser({
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    LoaderComponent: Spinner
})(AddRestaurantPage);
