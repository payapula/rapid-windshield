import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import theme from 'style';
import 'style/globals.css';
import { FirebaseAppProvider } from 'reactfire';
import 'firebase/firestore';
import firebaseConfig from 'firebase/config';
import initAuth from 'firebase/next-firebase-auth'; // the module you created above
import { useRapidAnalytics } from 'utils/hooks';

// next-firebase-auth would initialize the firebase with this initAuth() function
// reactfire would not initialize another instance, and would
// reuse this intialized instance
// https://github.com/FirebaseExtended/reactfire/blob/main/src/firebaseApp.tsx#L37
initAuth();

export default function App({ Component, pageProps }: AppProps): JSX.Element {
    useRapidAnalytics();
    return (
        <FirebaseAppProvider firebaseConfig={firebaseConfig}>
            <ChakraProvider theme={theme}>
                <Component {...pageProps} />
            </ChakraProvider>
        </FirebaseAppProvider>
    );
}
