import Head from 'next/head';
import { Button } from '@chakra-ui/react';

export const Home = (): JSX.Element => (
    <div className="container">
        <Head>
            <title>Create Next App</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Button>Chakra Button</Button>
        Hello Rapid Windshield
    </div>
);

export default Home;
