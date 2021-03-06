import { ArrowBackIcon, Search2Icon, StarIcon } from '@chakra-ui/icons';
import {
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    Heading,
    Icon,
    Text,
    useDisclosure
} from '@chakra-ui/react';
import { Linkbutton } from 'components/link-button';
import Link from 'next/link';
import React from 'react';
import { GrCircleInformation, GrInstagram, GrPhone } from 'react-icons/gr';
import { Restaurant } from 'types/restaurant';
import RapidAnalytics from 'utils/analytics';

const RestaurantHeader = (): JSX.Element => {
    return (
        <Flex alignItems="center">
            <Box marginRight="auto">
                <Linkbutton
                    href="/"
                    color="white"
                    background="pink.200"
                    _hover={{
                        background: 'pink.300'
                    }}
                    _active={{
                        background: 'pink.300'
                    }}>
                    <ArrowBackIcon w={5} h={5} />
                </Linkbutton>
            </Box>
            <Button
                w="0"
                h="0"
                _focus={{
                    boxShadow: 'none'
                }}>
                <Search2Icon w={5} h={5} color="blackAlpha.500" />
            </Button>
            <StarIcon ml="4" w={7} h={7} color="gray.300" />
        </Flex>
    );
};

const RestaurantInfo = ({ restaurant }: { restaurant: Restaurant }): JSX.Element => {
    const linkClicked = (type) => {
        RapidAnalytics.getInstance().logEvent(`${type}_clicked`, {
            restaurant_name: restaurant.name,
            restaurant_id: restaurant.id
        });
        return true;
    };

    return (
        <Flex mt="4">
            <Box marginRight="auto">
                <Heading
                    as="h1"
                    fontSize={{ base: '3xl', lg: '4xl' }}
                    fontWeight="extrabold"
                    color="pink.400">
                    {restaurant.name}
                </Heading>
                <Text opacity="0.8" mt="2" fontSize={{ base: 'md', lg: 'xl' }}>
                    {restaurant.type}
                </Text>
                <Flex opacity="0.8">
                    <Text fontSize={{ base: 'md', lg: 'lg' }}>{restaurant.location}</Text>
                    <Box marginLeft="2" marginRight="2">
                        |
                    </Box>
                    <Flex
                        alignItems="center"
                        justifyContent="space-between"
                        w={{ base: '10', lg: '12' }}
                        fontSize={{ base: 'sm', lg: 'md' }}>
                        <StarIcon boxSize={3.5} /> {restaurant.rating}
                    </Flex>
                </Flex>
            </Box>
            <Flex direction="column" pt="2" pb="1" alignItems="flex-end">
                {restaurant.about && (
                    <Box h="50%">
                        <RestaurantMoreInfoDrawer
                            restaurant={restaurant}
                            linkClicked={linkClicked}
                        />
                    </Box>
                )}
                <Flex mt="4" justifyContent="space-between" flexBasis="auto" direction="row">
                    {restaurant.instagramUrl && (
                        <Link href={restaurant.instagramUrl} passHref>
                            <Button
                                as="a"
                                w={8}
                                h={8}
                                target="_blank"
                                rel="noopener noreferrer"
                                background="transparent"
                                _focus={{
                                    boxShadow: 'none'
                                }}
                                _hover={{
                                    background: 'pink.200'
                                }}
                                _active={{
                                    background: 'pink.200'
                                }}
                                onClick={() => linkClicked('instagram')}>
                                <Icon as={GrInstagram} w={8} h={8} color="#dd3d5b" />
                            </Button>
                        </Link>
                    )}
                    {restaurant.phone && (
                        <Link href={`tel:${restaurant.phone}`} passHref>
                            <Button
                                as="a"
                                w={8}
                                h={8}
                                ml="5"
                                target="_blank"
                                background="transparent"
                                rel="noopener noreferrer"
                                _focus={{
                                    boxShadow: 'none'
                                }}
                                _hover={{
                                    background: 'pink.200'
                                }}
                                _active={{
                                    background: 'pink.200'
                                }}
                                onClick={() => linkClicked('phone')}>
                                <Icon as={GrPhone} w={8} h={8} color="#dd3d5b" />
                            </Button>
                        </Link>
                    )}
                </Flex>
            </Flex>
        </Flex>
    );
};

interface RestaurantMoreInfoDrawerProps {
    restaurant: Restaurant;
    linkClicked: (type: string) => void;
}

const RestaurantMoreInfoDrawer = ({ restaurant, linkClicked }: RestaurantMoreInfoDrawerProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Button
                w={8}
                h={8}
                _focus={{
                    boxShadow: 'none'
                }}
                background="transparent"
                _hover={{
                    background: 'pink.200'
                }}
                _active={{
                    background: 'pink.200'
                }}
                onClick={() => {
                    linkClicked('about');
                    onOpen();
                }}>
                <Icon as={GrCircleInformation} w={8} h={8} color="blue" />
            </Button>
            <Drawer isOpen={isOpen} placement="top" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>
                        <Text fontWeight="bold" fontSize={{ base: '2xl', lg: '3xl' }}>
                            About {restaurant.name}
                        </Text>
                    </DrawerHeader>
                    <DrawerBody pb="40px">
                        <Text>{restaurant.about}</Text>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export { RestaurantHeader, RestaurantInfo };
