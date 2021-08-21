import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import theme from 'style';
import 'style/globals.css';
import { FirebaseAppProvider } from 'reactfire';
import 'firebase/firestore';
import firebaseConfig from 'firebase/config';
import initAuth from 'firebase/next-firebase-auth'; // the module you created above
import { useRapidAnalytics } from 'utils/hooks';
import siteConfig from 'utils/site-configs';
import Head from 'next/head';
import { DefaultSeo } from 'next-seo';
import FaviconConfig from 'components/favicon-config';

// next-firebase-auth would initialize the firebase with this initAuth() function
// reactfire would not initialize another instance, and would
// reuse this intialized instance
// https://github.com/FirebaseExtended/reactfire/blob/main/src/firebaseApp.tsx#L37
initAuth();

const { seo } = siteConfig;

export default function App({ Component, pageProps }: AppProps): JSX.Element {
    useRapidAnalytics();
    return (
        <>
            <Head>
                <meta content="width=device-width, initial-scale=1" name="viewport" />
            </Head>
            <FaviconConfig />
            <DefaultSeo {...seo} />
            <FirebaseAppProvider firebaseConfig={firebaseConfig}>
                <ChakraProvider theme={theme}>
                    <Component {...pageProps} />
                </ChakraProvider>
            </FirebaseAppProvider>
        </>
    );
}
