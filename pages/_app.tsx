import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import theme from 'style';
import 'style/globals.css';

export default function App({ Component, pageProps }: AppProps): JSX.Element {
    return (
        <ChakraProvider theme={theme}>
            <Component {...pageProps} />
        </ChakraProvider>
    );
}
