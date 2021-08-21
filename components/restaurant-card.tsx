import { useRouter } from 'next/router';
import React from 'react';
import { Restaurant } from 'types/restaurant';
import { StarIcon } from '@chakra-ui/icons';
import { Flex, Box, Text, Badge } from '@chakra-ui/react';
import 'firebase/storage';
import { RestaurantImage } from './restaurant-image';

export function RestaurantCard(props: Restaurant): JSX.Element {
    const router = useRouter();
    const { name, location, type, rating, imageUrl, id } = props;

    const isExtraBadges = +rating < 4 || +rating > 4.3;

    const borderProps = isExtraBadges
        ? {
              borderBottom: '1px',
              borderStyle: 'dashed',
              paddingBottom: '5px',
              borderColor: 'brown'
          }
        : {};

    return (
        <Box>
            <Flex
                w="100%"
                h={{ base: '150px', lg: '180px' }}
                border="1px"
                borderColor="gray.300"
                borderRadius="4px"
                alignItems="center"
                padding="2"
                onClick={() => {
                    router.push(`restaurant/${id}`);
                }}
                cursor="pointer"
                boxShadow="sm">
                <div className="image-container">
                    <RestaurantImage imageUrl={imageUrl} restaurantName={name} />
                </div>
                <Flex direction="column" ml="6" flexGrow={2}>
                    <Box {...borderProps}>
                        <Text
                            as="div"
                            fontSize={{ base: 'lg', lg: '2xl' }}
                            fontWeight="bold"
                            className="card-food-image">
                            {name}
                        </Text>
                        <Text as="div" opacity="0.8" mt="2" fontSize={{ base: 'sm', lg: 'md' }}>
                            {type}
                        </Text>
                        <Flex opacity="0.8">
                            <Box fontSize={{ base: 'sm', lg: 'md' }}>{location}</Box>
                            <Box marginLeft="2" marginRight="2">
                                |
                            </Box>
                            <Flex
                                alignItems="center"
                                justifyContent="space-between"
                                w={{ base: '10', lg: '12' }}
                                fontSize={{ base: 'sm', lg: 'md' }}>
                                <StarIcon boxSize={3.5} /> {rating}
                            </Flex>
                        </Flex>
                    </Box>
                    {+rating < 4 ? (
                        <Badge
                            mt="2"
                            w="100px"
                            textAlign="center"
                            borderRadius="50%"
                            colorScheme="orange"
                            fontWeight="normal"
                            fontSize={{ base: 'sm', lg: 'md' }}>
                            40% Offer
                        </Badge>
                    ) : (
                        +rating > 4.3 && (
                            <Badge
                                mt="2"
                                w="100px"
                                textAlign="center"
                                borderRadius="50%"
                                colorScheme="yellow"
                                fontWeight="normal"
                                fontSize={{ base: 'sm', lg: 'md' }}>
                                Exclusive
                            </Badge>
                        )
                    )}
                </Flex>
            </Flex>
        </Box>
    );
}
