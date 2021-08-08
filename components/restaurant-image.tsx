import React from 'react';
import Image from 'next/image';
import 'firebase/storage';
import { isEmpty } from 'lodash';

const DEFAULT_IMAGE_SIZE = 150;

interface RestaurantImageProps {
    imageUrl: string;
    restaurantName: string;
    imageSize?: number;
}

export const RestaurantImage = ({
    imageUrl,
    restaurantName,
    imageSize = DEFAULT_IMAGE_SIZE
}: RestaurantImageProps): JSX.Element => {
    if (isEmpty(imageUrl)) {
        return null;
    }

    return (
        <Image
            className="card-food-image"
            src={imageUrl}
            width={imageSize}
            height={imageSize}
            objectFit="cover"
            alt={`${restaurantName}'s Logo `}
        />
    );
};