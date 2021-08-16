// ./pages/api/logout
import initAuth from 'firebase/next-firebase-auth';
import { unsetAuthCookies } from 'next-firebase-auth';

initAuth();

const handler = async (req, res): Promise<unknown> => {
    try {
        await unsetAuthCookies(req, res);
    } catch (e) {
        return res.status(500).json({ error: 'Unexpected error.' });
    }
    return res.status(200).json({ success: true });
};

export default handler;
