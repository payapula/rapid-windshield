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
        imageUrl: url,
        instagramUrl: 'https://www.instagram.com/virat.kohli/'
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
                label: FOODLABEL.VEG,
                description: 'Deliciously cooked dosa with curry leaves on top',
                category: 'Morning'
            },
            {
                id: '2',
                name: 'Dosa',
                price: 20,
                available: true,
                keywords: ['dosa', 'dosai', 'roast'],
                label: FOODLABEL.VEG,
                description:
                    'Deliciously cooked dosa with curry leaves on top Deliciously cooked dosa with curry leaves on top Deliciously cooked dosa with curry leaves on top',
                category: 'Morning'
            }
        ],
        Meals: [
            {
                id: '10',
                name: 'South Indian Meal',
                price: 80,
                available: true,
                keywords: ['idly', 'south', 'indian'],
                label: FOODLABEL.VEG,
                category: 'Meals'
            },
            {
                id: '11',
                name: 'Chapati With Korma',
                price: 55,
                available: true,
                keywords: ['dosa', 'dosai', 'roast'],
                label: FOODLABEL.VEG,
                category: 'Meals'
            },
            {
                id: '12',
                name: 'Chola Poori',
                price: 45,
                available: true,
                keywords: ['idly', 'south', 'indian'],
                label: FOODLABEL.VEG,
                category: 'Meals'
            }
        ],
        Afternoon: [
            {
                id: '3',
                name: 'Onion Rava Roast Dosa',
                price: 55,
                available: true,
                keywords: ['idly', 'south', 'indian'],
                label: FOODLABEL.VEG,
                category: 'Afternoon'
            },
            {
                id: '4',
                name: 'Paneer Masala Roast Dosa',
                price: 65,
                available: true,
                keywords: ['dosa', 'dosai', 'roast'],
                label: FOODLABEL.VEG,
                category: 'Afternoon'
            },
            {
                id: '5',
                name: 'Vegetable Noodles',
                price: 150,
                available: true,
                keywords: ['idly', 'south', 'indian'],
                label: FOODLABEL.VEG,
                category: 'Afternoon'
            },
            {
                id: '6',
                name: 'Chilly Mushroom',
                price: 120,
                available: true,
                keywords: ['dosa', 'dosai', 'roast'],
                label: FOODLABEL.VEG,
                category: 'Afternoon'
            }
        ],
        Evening: [
            {
                id: '7',
                name: 'Burger',
                price: 35,
                available: true,
                keywords: ['Burger', 'south', 'indian'],
                label: FOODLABEL.VEG,
                category: 'Evening'
            }
        ],
        'Quick Bites': [
            {
                id: '8',
                name: 'Channa Masala Puri',
                price: 35,
                available: true,
                keywords: ['Burger', 'south', 'indian'],
                label: FOODLABEL.VEG,
                category: 'Evening'
            },
            {
                id: '9',
                name: 'Banana Bajji',
                price: 35,
                available: true,
                keywords: ['Burger', 'south', 'indian'],
                label: FOODLABEL.VEG,
                category: 'Evening'
            }
        ]
    },
    '2': {}
};
