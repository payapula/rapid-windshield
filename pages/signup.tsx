import { Box, Button, Heading, Input } from '@chakra-ui/react';
import React from 'react';
import { Form, Field } from 'react-final-form';
import { useFirebaseApp, useFirestore } from 'reactfire';
import { isEmpty } from 'utils/utils';
import { useRouter } from 'next/router';

// interface Props {}

interface SignUpFields {
    email: string;
    password: string;
    confirmPassword: string;
}

const SignUp = (props) => {
    const app = useFirebaseApp();
    const router = useRouter();

    const onSubmit = async (values: SignUpFields) => {
        console.log(values);
        const { email, password, confirmPassword } = values;

        if (isEmpty(email) || isEmpty(password) || isEmpty(confirmPassword)) {
            console.log('Fill required Inputs');
        }

        if (password !== confirmPassword) {
            console.log('passwords do not match');
        }

        try {
            const user = await app.auth().createUserWithEmailAndPassword(email, password);
            app.firestore().collection('users').doc(user.user.uid).set({
                role: 'admin'
            });
            // On successful authentication
            router.push('/');
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    };

    return (
        <Box>
            <Heading>Sign Up!!</Heading>
            <Form<SignUpFields>
                onSubmit={onSubmit}
                render={({ handleSubmit, values }) => {
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
                            <Field
                                name="confirmPassword"
                                render={({ input }) => {
                                    return <Input {...input} placeholder="Confirm password" />;
                                }}
                            />
                            <Button type="submit">Submit</Button>
                        </form>
                    );
                }}
            />
        </Box>
    );
};

export default SignUp;
