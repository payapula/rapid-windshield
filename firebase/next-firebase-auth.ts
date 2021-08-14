import { init } from 'next-firebase-auth';
import firebaseConfig from './config';

const initAuth = (): void => {
    init({
        authPageURL: '/',
        appPageURL: '/',
        loginAPIEndpoint: '/api/login', // required
        logoutAPIEndpoint: '/api/logout', // required
        // firebaseAuthEmulatorHost: 'localhost:9099',
        // Required in most cases.
        firebaseAdminInitConfig: {
            credential: {
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                // The private key must not be accesssible on the client side.
                privateKey: process.env.FIREBASE_PRIVATE_KEY
            },
            databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
        },
        firebaseClientInitConfig: firebaseConfig,
        cookies: {
            name: 'rapidfire', // required
            // Keys are required unless you set `signed` to `false`.
            // The keys cannot be accessible on the client side.
            keys: [process.env.COOKIE_SECRET_CURRENT, process.env.COOKIE_SECRET_PREVIOUS],
            httpOnly: true,
            maxAge: 12 * 60 * 60 * 24 * 1000, // twelve days
            overwrite: true,
            path: '/',
            sameSite: 'strict',
            secure: false, // set this to false in local (non-HTTPS) development
            signed: true
        }
    });
};

export default initAuth;
