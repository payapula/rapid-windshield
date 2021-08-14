import React from 'react';
import Image from 'next/image';
import 'firebase/storage';
import { isEmpty } from 'lodash';
import { DEFAULT_IMAGE_SIZE, imagePlaceholder } from 'lib/data';

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
        return (
            <Image
                className="card-food-image"
                src={imagePlaceholder}
                width={imageSize}
                height={imageSize}
                objectFit="cover"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8w/DfFgAFdQIK7lDG6QAAAABJRU5ErkJggg=="
                alt={`${restaurantName}'s Temporary Logo`}
            />
        );
    }

    return (
        <Image
            className="card-food-image"
            src={imageUrl}
            width={imageSize}
            height={imageSize}
            objectFit="cover"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8w/DfFgAFdQIK7lDG6QAAAABJRU5ErkJggg=="
            alt={`${restaurantName}'s Logo `}
        />
    );
};
