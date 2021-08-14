import { Box, Flex, Text } from '@chakra-ui/react';
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
import { AddEditItemModalFields, ItemModal } from './modals/item-modal';
import { v4 as uuidv4 } from 'uuid';
import { DangerButton } from 'components/form/buttons';
import { GrFormTrash } from 'react-icons/gr';
import { Icon } from '@chakra-ui/react';

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
    const addItem = (values: AddEditItemModalFields, catergoryKey) => {
        const itemId = uuidv4();
        const itemData = {
            ...values,
            id: itemId,
            category: catergoryKey,
            available: true
        };
        addItemsToCategory(catergoryKey, { [itemId]: itemData });
    };
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
                            </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                            <Flex justifyContent="space-between">
                                <Flex justifyContent="space-around" w="40%">
                                    <CategoryModal
                                        submit={(name) => editCategory(catergoryKey, name)}
                                        mode="Edit"
                                        initialValues={{
                                            categoryName: catergoryKey
                                        }}
                                    />
                                    <DangerButton
                                        onClick={() => {
                                            deleteCategory(catergoryKey);
                                        }}>
                                        <Icon as={GrFormTrash} w={6} h={6} />
                                    </DangerButton>
                                </Flex>
                                <Box>
                                    <ItemModal submitItem={addItem} catergoryKey={catergoryKey} />
                                </Box>
                            </Flex>
                            <ItemCard
                                parentCategory={catergoryKey}
                                items={items}
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
