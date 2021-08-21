import { Restaurant } from 'types/restaurant';

export const DEFAULT_IMAGE_SIZE = 150;

export const imagePlaceholder = `https://source.unsplash.com/collection/3840296/${DEFAULT_IMAGE_SIZE}x${DEFAULT_IMAGE_SIZE}`;

export const restaurants: Restaurant[] = [
    {
        id: '1',
        name: 'Annapoorna',
        type: 'South Indian',
        location: 'R S Puram',
        rating: '4.5',
        imageUrl: imagePlaceholder,
        instagramUrl: 'https://www.instagram.com/virat.kohli/'
    },
    {
        id: '2',
        name: 'Anandhas',
        type: 'South Indian',
        location: 'Gandhipuram',
        rating: '4.2',
        imageUrl: imagePlaceholder
    },
    {
        id: '3',
        name: 'Dominos',
        type: 'Italian',
        location: 'NSR Road',
        rating: '3.6',
        imageUrl: imagePlaceholder
    },
    {
        id: '4',
        name: 'Fully Briyani',
        type: 'South Indian',
        location: 'Gandhipuram',
        rating: '3.9',
        imageUrl: imagePlaceholder
    }
];
