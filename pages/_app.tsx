import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import theme from 'style';
import 'style/globals.css';
import { FirebaseAppProvider } from 'reactfire';
import 'firebase/firestore';
import firebaseConfig from 'firebase/config';

export default function App({ Component, pageProps }: AppProps): JSX.Element {
    return (
        <FirebaseAppProvider firebaseConfig={firebaseConfig}>
            <ChakraProvider theme={theme}>
                <Component {...pageProps} />
            </ChakraProvider>
        </FirebaseAppProvider>
    );
}
