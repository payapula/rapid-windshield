import { Box } from '@chakra-ui/react';
import { Linkbutton } from 'components/link-button';
import { AuthUser } from 'next-firebase-auth';
import React, { ReactElement } from 'react';

interface AdminPanelProps {
    user: AuthUser;
}

const AdminPanel = ({ user }: AdminPanelProps): ReactElement => {
    return (
        <Box>
            <Linkbutton href="/admin/manage">Add Restaurant</Linkbutton>

            <Linkbutton href="/">Go Home</Linkbutton>
        </Box>
    );
};

export default AdminPanel;

//** Get User Data */
// const docRef = useFirestore().collection('users').doc(user.data.uid);
// const { status, data } = useFirestoreDocDataOnce<RapidFireUser>(docRef);

// if (status === 'loading' || status === 'error') {
//     return <Spinner />;
// }

// const isAdmin = data.role === 'Admin';

// if (!isAdmin) {
//     return <Box>You Dont have access here.!</Box>;
// }
