export interface Restaurant {
    id: string;
    name: string;
    type: string;
    location: string;
    rating: string;
    imageUrl: string;
}

export interface RestaurantWithMenu extends Restaurant {
    menu: Category;
}

export interface Menu {
    [key: string]: Category;
}

interface Category {
    [key: string]: Dish[];
}

export enum FOODLABEL {
    VEG = 'VEG',
    NON_VEG = 'NON_VEG',
    EGG = 'EGG'
}

export interface Dish {
    id: string;
    name: string;
    price: number;
    available: boolean;
    keywords: string[];
    status: FOODLABEL;
    description?: string;
}
