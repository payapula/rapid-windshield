import { ChevronRightIcon } from '@chakra-ui/icons';
import {
    Button,
    Flex,
    Icon,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Portal,
    Text
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { ImSpoonKnife } from 'react-icons/im';
import { RestaurantWithMenu } from 'types/restaurant';
import { useScrollSpy } from 'utils/hooks';
import { navigateToCategoryView } from 'utils/restaurant';
import { isEmpty } from 'utils/utils';

const BrowseMenu = ({ restaurant }: { restaurant: RestaurantWithMenu }): JSX.Element => {
    const [isOpen, setIsOpen] = React.useState(false);
    const open = () => setIsOpen(!isOpen);
    const close = () => setIsOpen(false);
    const { menu } = restaurant;

    if (isEmpty(menu)) {
        return null;
    }

    const totalCategories = Object.keys(restaurant.menu).length;

    const categoryArr = React.useMemo(
        () =>
            Object.entries(menu).map(
                ([category]) => `[id="${category.replace(/\s+/g, '-').toLowerCase()}"]`
            ),
        [menu]
    );

    const selected = useScrollSpy(categoryArr, {
        rootMargin: '0% 0% -60% 0%'
    });

    return (
        <Popover returnFocusOnClose={false} isOpen={isOpen} onClose={close}>
            <PopoverTrigger>
                <Button
                    w={{ base: '160px', lg: '200px' }}
                    h="50px"
                    borderRadius="50px"
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
                    <Icon as={ImSpoonKnife} w={4} h={4} color="white" mr="2" />
                    <Text textTransform="uppercase" fontSize={{ base: 'sm', lg: 'xl' }}>
                        Browse Menu
                    </Text>
                </Button>
            </PopoverTrigger>
            <Portal>
                <PopoverContent
                    border="1px"
                    borderColor="gray.400"
                    className="browse-menu-popover"
                    top="60px"
                    p="1.5">
                    {Object.entries(menu).map(([categoryName, menu], index) => {
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
            cursor="pointer"
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

export { BrowseMenu };
