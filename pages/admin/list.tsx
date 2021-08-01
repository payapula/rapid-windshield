import { Spinner } from '@chakra-ui/react';
import React from 'react';
import { AuthAction, AuthUser, useAuthUser, withAuthUser } from 'next-firebase-auth';
import AdminPanel from 'components/admin/panel';

const List = () => {
    const user: AuthUser = useAuthUser();
    return <AdminPanel user={user} />;
};

export default withAuthUser({
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    LoaderComponent: Spinner
})(List);
