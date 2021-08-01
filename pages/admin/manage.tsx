import { Spinner } from '@chakra-ui/react';
import router, { useRouter } from 'next/router';
import React from 'react';
import { useUser, useFirestore, useFirestoreDocDataOnce, useSigninCheck } from 'reactfire';
import { RapidFireUser } from 'types/user';
import { isEmpty } from 'utils/utils';

const Manage = (props) => {
    const user = useUser();
    const router = useRouter();

    if (isEmpty(user)) {
        return router.push('/');
    }

    const docRef = useFirestore().collection('users').doc(user.data.uid);
    const { status, data } = useFirestoreDocDataOnce<RapidFireUser>(docRef);

    if (status === 'loading' || status === 'error') {
        return <Spinner />;
    }

    if (data.role !== 'Admin') {
        return router.push('/');
    }

    return <div>Admin Panel!!</div>;
};

export default Manage;
