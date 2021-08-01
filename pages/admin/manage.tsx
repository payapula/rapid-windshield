import { Spinner } from '@chakra-ui/react';
import React from 'react';
import AdminPanel from './admin.panel';
import { AuthAction, useAuthUser, withAuthUser } from 'next-firebase-auth';

const Manage = (props) => {
    const user = useAuthUser();
    return <AdminPanel user={user} />;
};

export default withAuthUser({
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    LoaderComponent: Spinner
})(Manage);
