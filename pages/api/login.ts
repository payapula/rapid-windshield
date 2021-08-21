/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// ./pages/api/login
import initAuth from 'firebase/next-firebase-auth';
import { setAuthCookies } from 'next-firebase-auth';

initAuth();

const handler = async (req, res): Promise<unknown> => {
    try {
        await setAuthCookies(req, res);
    } catch (e) {
        return res.status(500).json({ error: 'Unexpected error.' });
    }
    return res.status(200).json({ success: true });
};

export default handler;
