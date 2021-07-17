import { Restaurant, Menu, FOODLABEL } from 'types/restaurant';

const imageSize = '150';

const url = `https://source.unsplash.com/user/slashiotarhini/${imageSize}x${imageSize}`;

export const restaurants: Restaurant[] = [
    {
        id: '1',
        name: 'Annapoorna',
        type: 'South Indian',
        location: 'R S Puram',
        rating: '4.5',
        imageUrl: url
    },
    {
        id: '2',
        name: 'Anandhas',
        type: 'South Indian',
        location: 'Gandhipuram',
        rating: '4.2',
        imageUrl: url
    },
    {
        id: '3',
        name: 'Dominos',
        type: 'Italian',
        location: 'NSR Road',
        rating: '3.6',
        imageUrl: url
    },
    {
        id: '4',
        name: 'Fully Briyani',
        type: 'South Indian',
        location: 'Gandhipuram',
        rating: '3.9',
        imageUrl: url
    }
];

export const menu: Menu = {
    '1': {
        Morning: [
            {
                id: '1',
                name: 'Idly',
                price: 20,
                available: true,
                keywords: ['idly', 'south', 'indian'],
                status: FOODLABEL.VEG
            },
            {
                id: '2',
                name: 'Dosa',
                price: 20,
                available: true,
                keywords: ['dosa', 'dosai', 'roast'],
                status: FOODLABEL.VEG
            }
        ],
        Afternoon: [],
        Evening: [
            {
                id: '3',
                name: 'Burger',
                price: 50,
                available: true,
                keywords: ['Burger', 'south', 'indian'],
                status: FOODLABEL.VEG
            }
        ]
    },
    '2': {}
};
