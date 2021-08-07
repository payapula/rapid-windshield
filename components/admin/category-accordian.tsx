import { Button, Text } from '@chakra-ui/react';
import React from 'react';
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon
} from '@chakra-ui/react';
import { map } from 'lodash';
import { CategoryModal } from './modals/category-modal';
import { ItemCard } from './item-card';
import { AdminCategory } from 'types/restaurant';

interface CategoryAccordionProps {
    category: AdminCategory;
    deleteCategory: (category: string) => void;
    addItemsToCategory: (category: string, item: any) => void;
    deletItem: (categoryId: string, id: string) => void;
    editItem: (categoryId: string, id: string, updatedItem: any) => void;
    editCategory: (categoryId: string, newName: string) => void;
}

export const CategoryAccordion = ({
    category,
    editCategory,
    deleteCategory,
    addItemsToCategory,
    deletItem,
    editItem
}: CategoryAccordionProps): JSX.Element => {
    return (
        <Accordion defaultIndex={[0]} allowMultiple>
            {map(category, (items, catergoryKey) => {
                return (
                    <AccordionItem key={catergoryKey}>
                        <h2>
                            <AccordionButton>
                                <Text
                                    fontSize="2xl"
                                    color="pink.400"
                                    fontWeight="bold"
                                    flex="1"
                                    textAlign="left">
                                    {catergoryKey}
                                </Text>
                                <AccordionIcon />
                                <Button
                                    onClick={() => {
                                        deleteCategory(catergoryKey);
                                    }}>
                                    Delete
                                </Button>
                                <CategoryModal
                                    submit={(name) => editCategory(catergoryKey, name)}
                                    mode="Edit"
                                    initialValues={{
                                        categoryName: catergoryKey
                                    }}
                                />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                            <ItemCard
                                parentCategory={catergoryKey}
                                items={items}
                                addItemsToCategory={addItemsToCategory}
                                deletItem={deletItem}
                                editItem={editItem}
                            />
                        </AccordionPanel>
                    </AccordionItem>
                );
            })}
        </Accordion>
    );
};
