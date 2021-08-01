import { Box, Button } from '@chakra-ui/react';
import { AuthUser } from 'next-firebase-auth';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';

interface AdminPanelProps {
    user: AuthUser;
}

const AdminPanel = ({ user }: AdminPanelProps): ReactElement => {
    const router = useRouter();

    return (
        <Box>
            <Button
                onClick={() => {
                    router.push('/admin/manage');
                }}>
                Add Restaurant
            </Button>
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
