export interface Restaurant {
    id: string;
    name: string;
    type: string;
    location: string;
    rating: string;
    imageUrl: string;
    instagramUrl?: string;
    websiteUrl?: string;
    phone?: string;
    about?: string;
}

export interface RestaurantWithMenu extends Restaurant {
    menu: Category;
}

export interface Menu {
    [key: string]: Category;
}

export interface Category {
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
    keywords?: string[];
    label: FOODLABEL;
    description?: string;
    category: string;
    enabled: boolean;
}

export interface Items {
    [key: string]: Dish;
}

export interface AdminCategory {
    [key: string]: Items;
}

export interface AddRestaurantForm {
    name: string;
    type: string;
    location: string;
    rating: string;
    instagramUrl: string;
    websiteUrl: string;
    imageUrl: string;
    phone: string;
    about: string;
}
