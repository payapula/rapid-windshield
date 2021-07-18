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
    Icon,
    Text,
    useDisclosure
} from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';
import { GrCircleInformation, GrInstagram } from 'react-icons/gr';
import { RestaurantWithMenu } from 'types/restaurant';

const RestaurantHeader = (): JSX.Element => {
    return (
        <Flex alignItems="center">
            <Box marginRight="auto">
                <Link href="/" passHref>
                    <Button as="a">
                        <ArrowBackIcon w={5} h={5} />
                    </Button>
                </Link>
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

const RestaurantInfo = ({ restaurant }: { restaurant: RestaurantWithMenu }): JSX.Element => {
    return (
        <Flex mt="4">
            <Box marginRight="auto">
                <Text fontSize={{ base: '3xl', lg: '2xl' }} fontWeight="bold">
                    {restaurant.name}
                </Text>
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
            <Flex direction="column" padding="2">
                <Box h="50%">
                    <RestaurantMoreInfoDrawer restaurant={restaurant} />
                </Box>
                {restaurant.instagramUrl && (
                    <Box mt="2">
                        <Link href={restaurant.instagramUrl} passHref>
                            <Button
                                as="a"
                                w="0"
                                h="0"
                                target="_blank"
                                rel="noopener noreferrer"
                                _focus={{
                                    boxShadow: 'none'
                                }}>
                                <Icon as={GrInstagram} w={8} h={8} color="#dd3d5b" />
                            </Button>
                        </Link>
                    </Box>
                )}
            </Flex>
        </Flex>
    );
};

const RestaurantMoreInfoDrawer = ({ restaurant }: { restaurant: RestaurantWithMenu }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Button
                w="0"
                h="0"
                _focus={{
                    boxShadow: 'none'
                }}
                onClick={onOpen}>
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
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. ellentesque
                        volutpat est ut convallis lacinia. Proin vulputate sapien ligula, vel
                        ullamcorper ipsum dapibus id. Donec ut hendrerit nulla. Cras interdum
                        efficitur tellus. Aliquam sed iaculis orci, quis scelerisque leo. Fusce
                        rutrum vulputate odio, ac condimentum justo dignissim at. Mauris aliquet sed
                        tortor vitae feugiat. Praesent vel volutpat sapien. Pellentesque pretium
                        semper lacus in consequat. Phasellus pellentesque ante id purus porta
                        vehicula.
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export { RestaurantHeader, RestaurantInfo };
