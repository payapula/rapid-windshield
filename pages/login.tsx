import { Box, Button, Heading, Input } from '@chakra-ui/react';
import React from 'react';
import { Form, Field } from 'react-final-form';
import { useFirebaseApp, useSigninCheck } from 'reactfire';
import { isEmpty } from 'utils/utils';
import { useRouter } from 'next/router';

interface LoginProps {
    email: string;
    password: string;
}

const Login = (props) => {
    const app = useFirebaseApp();
    const router = useRouter();
    const { status, data: signInCheckResult } = useSigninCheck();

    const onSubmit = async (values: LoginProps) => {
        console.log(values);
        const { email, password } = values;

        if (isEmpty(email) || isEmpty(password)) {
            console.log('Fill required Inputs');
        }
        try {
            app.auth().signInWithEmailAndPassword(email, password);
        } catch (error) {
            throw new Error(error);
        }
    };

    if (status === 'success' && signInCheckResult.signedIn) {
        router.push('/');
    }

    return (
        <Box>
            <Heading>Log In!!</Heading>
            <Form<LoginProps>
                onSubmit={onSubmit}
                render={({ handleSubmit }) => {
                    return (
                        <form onSubmit={handleSubmit}>
                            <Field
                                name="email"
                                render={({ input }) => {
                                    return <Input {...input} placeholder="Email" />;
                                }}
                            />
                            <Field
                                name="password"
                                render={({ input }) => {
                                    return <Input {...input} placeholder="Password" />;
                                }}
                            />
                            <Button type="submit">Login</Button>
                        </form>
                    );
                }}
            />
        </Box>
    );
};

export default Login;
