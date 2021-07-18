import { StarIcon } from '@chakra-ui/icons';
import {
    Box,
    Button,
    Flex,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Portal,
    Text
} from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { NextRouter, useRouter } from 'next/router';
import React from 'react';
import { Dish, FOODLABEL, RestaurantWithMenu } from 'types/restaurant';
import { ChevronRightIcon } from '@chakra-ui/icons';
import Head from 'next/head';
import { useScrollSpy } from 'utils/hooks';
// - Client side rendering of data

// export default function RestaurantInfo(props): JSX.Element {
//     const [restaurant, setRestaurant] = React.useState<RestaurantWithMenu>(null);

//     React.useEffect(() => {
//         fetch(`/api/restaurants/${props.id}`)
//             .then((res) => res.json())
//             .then(
//                 (data) => {
//                     console.log(data.restaurant);
//                     setRestaurant(data.restaurant);
//                 },
//                 (error) => {
//                     // eslint-disable-next-line no-console
//                     console.log(error);
//                 }
//             );
//     }, []);

//     if (restaurant === null || restaurant === void 0) {
//         return <div>Loading...</div>;
//     }

//     return <div>viewing restaurant {restaurant.name}</div>;
// }

// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
//     return {
//         props: { id: params.id }
//     };
// };

// Server side Data Fetching
interface RestaurantInfoProps {
    restaurant: RestaurantWithMenu;
}

export default function RestaurantInfo({ restaurant }: RestaurantInfoProps): JSX.Element {
    return (
        <Box className="restaurant-page">
            <Head>
                <title>{restaurant.name}</title>
            </Head>
            <Flex
                padding="4"
                background="#e5eef1"
                direction="column"
                // border="1px"
                // borderStyle="solid"
                // borderColor="red"
                minH="100vh">
                <Box background="white" padding="2.5">
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
                <Box padding="2">
                    <Text fontSize={{ base: '2xl', lg: 'xl' }} fontWeight="bold">
                        Menu
                    </Text>
                    <MenuPanel restaurant={restaurant} />
                </Box>
                <Flex h="120px" p="2" justifyContent="center">
                    <Text fontSize={{ base: 'md', lg: 'lg' }} opacity="0.8">
                        FSSAI License Number: 123465498745654
                    </Text>
                </Flex>
                <BrowseMenu restaurant={restaurant} />
            </Flex>
        </Box>
    );
}

const BrowseMenu = ({ restaurant }: { restaurant: RestaurantWithMenu }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const open = () => setIsOpen(!isOpen);
    const close = () => setIsOpen(false);

    const totalCategories = Object.keys(restaurant.menu).length;

    const categoryArr = React.useMemo(
        () =>
            Object.entries(restaurant.menu).map(
                ([category]) => `[id="${category.replace(/\s+/g, '-').toLowerCase()}"]`
            ),
        [restaurant.menu]
    );

    const selected = useScrollSpy(categoryArr, {
        rootMargin: '0% 0% -60% 0%'
    });

    return (
        <Popover returnFocusOnClose={false} isOpen={isOpen} onClose={close}>
            <PopoverTrigger>
                <Button
                    w="130px"
                    h="50px"
                    color="white"
                    backgroundColor="black"
                    p="2"
                    position="fixed"
                    bottom="5%"
                    left="50%"
                    transform="auto"
                    translateX="-50%"
                    _hover={{
                        backgroundColor: 'black'
                    }}
                    onClick={() => open()}>
                    Browse Menu
                </Button>
            </PopoverTrigger>
            <Portal>
                <PopoverContent
                    border="1px"
                    borderColor="gray.400"
                    className="browse-menu-popover"
                    top="60px"
                    p="1.5">
                    {Object.entries(restaurant.menu).map(([categoryName, menu], index) => {
                        return (
                            <PopoverMenuCard
                                key={categoryName}
                                menu={menu}
                                categoryName={categoryName}
                                close={close}
                                isLast={totalCategories - 1 === index}
                                selected={selected}
                            />
                        );
                    })}
                </PopoverContent>
            </Portal>
        </Popover>
    );
};

const PopoverMenuCard = ({ categoryName, menu, close, isLast, selected }) => {
    const router = useRouter();
    const hashLink = categoryName.replace(/\s+/g, '-').toLowerCase();

    const isSelected = selected === hashLink;

    return (
        <Flex
            key={categoryName}
            height="60px"
            borderBottom={isLast ? '0' : '1px'}
            borderStyle="dashed"
            justifyContent="space-between"
            alignItems="center"
            p="1.5"
            fontWeight={isSelected ? 'bold' : 'normal'}
            onClick={() => {
                navigateToCategoryView(router, hashLink);
                close();
            }}>
            <Flex alignItems="center">
                {isSelected ? <ChevronRightIcon w={6} h={6} color="pink.400" /> : <></>}
                <Text fontSize={{ base: 'xl', lg: '2xl' }}>{categoryName}</Text>
            </Flex>
            <Text fontSize={{ base: 'xl', lg: '2xl' }}> {menu.length}</Text>
        </Flex>
    );
};

const MenuPanel = ({ restaurant }: { restaurant: RestaurantWithMenu }) => {
    const { menu } = restaurant;

    if (menu === null || menu === void 0) {
        return null;
    }

    return (
        <Flex direction="column" marginLeft="-1" marginRight="-1">
            {Object.entries(menu).map(([categoryName, menu]) => (
                <CategoryPanel key={categoryName} categoryName={categoryName} menu={menu} />
            ))}
        </Flex>
    );
};

interface CategoryPanelProps {
    categoryName: string;
    menu: Dish[];
}

const CategoryPanel = ({ categoryName, menu }: CategoryPanelProps) => {
    const hashLink = categoryName.replace(/\s+/g, '-').toLowerCase();
    const router = useRouter();

    return (
        <Flex
            key={categoryName}
            marginTop="5px"
            marginBottom="5px"
            direction="column"
            background="white"
            borderRadius="4px"
            padding="2">
            <h2
                id={hashLink}
                className="catergory-link-scroll-margin"
                onClick={() => {
                    navigateToCategoryView(router, hashLink);
                }}>
                <Text
                    flex="1"
                    textAlign="left"
                    fontWeight="extrabold"
                    color="pink.400"
                    fontSize={{ base: '2xl', lg: 'xl' }}>
                    {categoryName} ({menu.length})
                </Text>
            </h2>
            <Flex direction="column">
                {menu.map((dish, index) => {
                    return (
                        <MenuCard key={dish.id} dish={dish} isLast={menu.length - 1 === index} />
                    );
                })}
            </Flex>
        </Flex>
    );
};

const MenuCard = ({ dish, isLast }: { dish: Dish; isLast: boolean }) => {
    return (
        <Flex
            alignItems="center"
            height={{ base: '100px', lg: '120px' }}
            justifyContent="space-between"
            borderBottom={isLast ? '0' : '1px'}
            borderStyle="dashed">
            <Flex direction="column">
                <Text fontSize={{ base: 'sm', lg: 'md' }}>
                    {dish.status === FOODLABEL.VEG ? 'VEG' : 'NON-VEG'}
                </Text>
                <Text fontSize={{ base: 'xl', lg: '2xl' }} fontWeight="bold">
                    {dish.name}
                </Text>
            </Flex>
            <Box border="1px" borderColor="blue.100" borderRadius="4px" padding="1.5">
                <Text fontSize={{ base: 'xl', lg: '2xl' }}>Rs.{dish.price}</Text>
            </Box>
        </Flex>
    );
};

const navigateToCategoryView = (router: NextRouter, hashLink: string) => {
    const urlWithouHash = router.asPath.split('#')[0];
    window.history.replaceState(null, '', `${urlWithouHash}#${hashLink}`);
    document.getElementById(hashLink).scrollIntoView({
        behavior: 'smooth'
    });
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const response = await fetch(`http://localhost:3001/api/restaurants/${params.id}`);
    const data = await response.json();
    return {
        props: { restaurant: data.restaurant }
    };
};
