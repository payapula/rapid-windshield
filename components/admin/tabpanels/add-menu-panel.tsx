import { Box, Button, Flex } from '@chakra-ui/react';
import React from 'react';
import { isEmpty } from 'utils/utils';
import { cloneDeep, forEach, map, omit } from 'lodash';
import { AdminCategory, Dish, Restaurant } from 'types/restaurant';
import { CategoryModal } from '../modals/category-modal';
import { CategoryAccordion } from '../category-accordian';
import { arrangeDishesByCategory } from 'utils/restaurant';
import { useRapidToast } from 'utils/hooks';

interface AddMenuProps {
    firestore: firebase.default.firestore.Firestore;
    setTab: React.Dispatch<React.SetStateAction<number>>;
    restaurantDetails: Restaurant;
    dishes: Dish[];
}

export const AddMenuPanel = ({
    firestore,
    restaurantDetails,
    setTab,
    dishes = null
}: AddMenuProps): JSX.Element => {
    const [category, setCategory] = React.useState<AdminCategory>(() =>
        arrangeDishesByCategory(dishes)
    );
    const toast = useRapidToast();

    // To Enable the Save Restaurant Button,
    // When Atleas one Item exists inside category
    let anItemExisits = false;
    forEach(category, (cat) => {
        forEach(cat, (dis) => {
            if (dis.id) {
                anItemExisits = true;
            }
        });
    });

    const saveRestaurant = async () => {
        try {
            const batch = firestore.batch();

            const restaurantId = restaurantDetails.id;
            const restaurantRef = firestore.collection('restaurants').doc(restaurantId);

            batch.set(restaurantRef, restaurantDetails);

            const menuCollection = firestore
                .collection('restaurants')
                .doc(restaurantId)
                .collection('menu');
            forEach(category, (category) => {
                forEach(category, (item) => {
                    const itemRef = menuCollection.doc(item.id);
                    batch.set(itemRef, item);
                });
            });
            await batch.commit();
            toast({
                title: 'Restaurant Saved',
                duration: 3000
            });
        } catch (error) {
            toast({
                title: 'We ran into some error',
                description: 'Something really bad happened while saving the restaurant',
                status: 'error'
            });
            // eslint-disable-next-line no-console
            console.log(JSON.stringify(error, null, 2));
        }
    };

    const addCategory = (categoryName) => {
        setCategory((categories) => ({ ...categories, [categoryName]: {} }));
    };

    const editCategory = (exisingCategoryName, newName) => {
        const clonedCategories = cloneDeep(category);

        // Update 'category' property
        const itemsWithUpdatedCategory = map(clonedCategories[exisingCategoryName], (item) => {
            return {
                ...item,
                category: newName
            };
        });

        const newCategory = {
            [newName]: itemsWithUpdatedCategory
        };

        const newCategoryList = omit(category, exisingCategoryName);
        setCategory({ ...newCategoryList, ...newCategory });
    };

    const deleteCategory = (categoryName) => {
        const newCategoryList = omit(category, categoryName);
        setCategory(newCategoryList);
    };

    const addItemsToCategory = (categoryName, item) => {
        const updateCategory = {
            [categoryName]: {
                ...category[categoryName],
                ...item
            }
        };
        const updatedCategories = {
            ...category,
            ...updateCategory
        };

        setCategory(updatedCategories);
    };

    const deletItem = (categoryId, itemId) => {
        const selectedCategory = category[categoryId];
        const categoryWithItemRemoved = omit(selectedCategory, itemId);
        setCategory((categories) => ({ ...categories, [categoryId]: categoryWithItemRemoved }));
    };

    const editItem = (categoryId, itemId, updatedItem) => {
        const clonedCategories = cloneDeep(category);
        clonedCategories[categoryId][itemId] = updatedItem;
        setCategory(clonedCategories);
    };

    return (
        <Flex
            direction="column"
            justifyContent="space-between"
            alignItems="center"
            // border="1px"
            // borderColor="cadetblue"
        >
            {/* <pre>{JSON.stringify(category, null, 2)}</pre> */}
            <Box w={{ base: '100%', sm: '90%', md: '95%', xl: '60%' }}>
                <CategoryModal submit={addCategory} />
                {!isEmpty(category) && (
                    <CategoryAccordion
                        category={category}
                        deleteCategory={deleteCategory}
                        addItemsToCategory={addItemsToCategory}
                        deletItem={deletItem}
                        editItem={editItem}
                        editCategory={editCategory}
                    />
                )}
            </Box>
            <Flex w="60%" mt="10" justifyContent="space-around">
                <Button onClick={() => setTab(0)}>Previous</Button>
                <Button onClick={saveRestaurant} colorScheme="blue" isDisabled={!anItemExisits}>
                    Save Restaurant
                </Button>
            </Flex>
        </Flex>
    );
};
