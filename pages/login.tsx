import { Box, Button, Heading, Spinner } from '@chakra-ui/react';
import React from 'react';
import { Form } from 'react-final-form';
import { useFirebaseApp, useSigninCheck } from 'reactfire';
import { useRouter } from 'next/router';
import { InputField } from 'components/form/inputfield';
import { AuthAction, withAuthUser } from 'next-firebase-auth';

interface LoginProps {
    email: string;
    password: string;
}

const Login = (): JSX.Element => {
    const app = useFirebaseApp();
    const router = useRouter();
    const { status, data: signInCheckResult } = useSigninCheck();

    const onSubmit = async (values: LoginProps) => {
        try {
            const { email, password } = values;
            app.auth().signInWithEmailAndPassword(email, password);
        } catch (error) {
            throw new Error(error);
        }
    };

    React.useEffect(() => {
        if (status === 'success' && signInCheckResult.signedIn) {
            router.push('/');
        }
    }, [status, signInCheckResult]);

    return (
        <Box>
            <Heading as="h1">Log In!!</Heading>
            <Form<LoginProps>
                onSubmit={onSubmit}
                render={({ handleSubmit, invalid, submitting }) => {
                    return (
                        <form onSubmit={handleSubmit}>
                            <InputField name="email" labelText="Email" isRequired />
                            <InputField
                                name="password"
                                labelText="Password"
                                inputType="password"
                                isRequired
                            />
                            <Button
                                type="submit"
                                disabled={invalid || submitting}
                                isLoading={submitting || status === 'loading'}>
                                Login
                            </Button>
                        </form>
                    );
                }}
            />
        </Box>
    );
};

export default withAuthUser({
    whenAuthed: AuthAction.REDIRECT_TO_APP,
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
    LoaderComponent: Spinner
})(Login);
