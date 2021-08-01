import { Spinner } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { useUser } from 'reactfire';
import { isEmpty } from 'utils/utils';
import 'firebase/auth';
import AdminPanel from './admin.panel';

const Manage = (props) => {
    const { data: user, status } = useUser();
    const router = useRouter();

    if (status === 'loading' || status === 'error') {
        return <Spinner />;
    }

    if (isEmpty(user)) {
        return router.push('/');
    }

    return <AdminPanel user={user} />;
};

export default Manage;
