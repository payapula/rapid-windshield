/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { restaurants, menu } from 'lib/data';

export default function restaurantHandler(req, res) {
    const {
        query: { id },
        method
    } = req;

    switch (method) {
        case 'GET': {
            const restaurant = restaurants.find((x) => x.id === id);
            res.status(200).json({
                restaurant: {
                    ...restaurant,
                    menu: menu[id]
                }
            });
            break;
        }
        default:
            res.setHeader('Allow', ['GET']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
