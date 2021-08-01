import { Box, Spinner } from '@chakra-ui/react';
import React, { ReactElement } from 'react';
import { useFirestore, useFirestoreDocDataOnce } from 'reactfire';
import { RapidFireUser } from 'types/user';

const AdminPanel = ({ user }): ReactElement => {
    const docRef = useFirestore().collection('users').doc(user.data.uid);
    const { status, data } = useFirestoreDocDataOnce<RapidFireUser>(docRef);

    if (status === 'loading' || status === 'error') {
        return <Spinner />;
    }

    const isAdmin = data.role === 'Admin';

    if (!isAdmin) {
        return <Box>You Dont have access here.!</Box>;
    }

    return <div>Authenitcated Admin panel</div>;
};

export default AdminPanel;
