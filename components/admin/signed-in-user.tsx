import { Button, Spinner, Flex } from '@chakra-ui/react';
import React from 'react';
import { useAuth, useFirestore, useFirestoreDocDataOnce, useUser } from 'reactfire';
import 'firebase/auth';
import { RapidFireUser } from 'types/user';
import { isEmpty } from 'utils/utils';
import { Linkbutton } from 'components/link-button';

interface SignedInUserProps {
    setAdmin: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignedInUser = ({ setAdmin }: SignedInUserProps): JSX.Element => {
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

export default SignedInUser;
