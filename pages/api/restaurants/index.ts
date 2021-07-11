import { restaurants } from 'lib/data';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function handler(req, res) {
    res.status(200).json(restaurants);
}
