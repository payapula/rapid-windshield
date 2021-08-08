import { Box, Button } from '@chakra-ui/react';
import React from 'react';
import { isEmpty } from 'utils/utils';
import { cloneDeep, forEach, map, omit } from 'lodash';
import { AdminCategory, Dish, Restaurant } from 'types/restaurant';
import { CategoryModal } from '../modals/category-modal';
import { CategoryAccordion } from '../category-accordian';
import { arrangeDishesByCategory } from 'utils/restaurant';

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
        } catch (error) {
            throw new Error('Some Error happened');
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
        <Box
        // border="1px"
        // borderColor="cadetblue"
        >
            {/* <pre>{JSON.stringify(category, null, 2)}</pre> */}
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
            <Button onClick={() => setTab(0)} variant="ghost">
                Previous
            </Button>
            <Button onClick={saveRestaurant} colorScheme="blue" isDisabled={!anItemExisits}>
                Save Restaurant
            </Button>
        </Box>
    );
};
