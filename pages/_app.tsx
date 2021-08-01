import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import theme from 'style';
import 'style/globals.css';
import { FirebaseAppProvider } from 'reactfire';
import 'firebase/firestore';
import firebaseConfig from 'firebase/config';
import initAuth from 'firebase/next-firebase-auth'; // the module you created above

// This would initialize the firebase
// reactfire would not initialize another instance, and would
// reuse this intialized instance
// https://github.com/FirebaseExtended/reactfire/blob/main/src/firebaseApp.tsx#L37
initAuth();

export default function App({ Component, pageProps }: AppProps): JSX.Element {
    return (
        <FirebaseAppProvider firebaseConfig={firebaseConfig}>
            <ChakraProvider theme={theme}>
                <Component {...pageProps} />
            </ChakraProvider>
        </FirebaseAppProvider>
    );
}
