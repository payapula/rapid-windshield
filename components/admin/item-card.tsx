import { Button, Flex } from '@chakra-ui/react';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { map } from 'lodash';
import { Items } from 'types/restaurant';
import { MenuCard } from 'components/restaurant-page/menu-panel';
import { AddEditItemModalFields, ItemModal } from './modals/item-modal';

interface ItemCardProps {
    parentCategory: string;
    items: Items;
    addItemsToCategory: (category: string, item: any) => void;
    deletItem: (categoryId: string, id: string) => void;
    editItem: (categoryId: string, id: string, updatedItem: any) => void;
}

export const ItemCard = ({
    parentCategory,
    items,
    addItemsToCategory,
    deletItem,
    editItem
}: ItemCardProps): JSX.Element => {
    const addItem = (values: AddEditItemModalFields) => {
        const itemId = uuidv4();
        const itemData = {
            ...values,
            id: itemId,
            category: parentCategory,
            available: true
        };
        addItemsToCategory(parentCategory, { [itemId]: itemData });
    };

    const editItemLocal = (parentCategory, itemId, values) => {
        const editedData = {
            ...values,
            id: itemId,
            category: parentCategory,
            available: true
        };

        editItem(parentCategory, itemId, editedData);
    };

    return (
        <div>
            <ItemModal submitItem={addItem} />
            {map(items, (item) => {
                return (
                    <Flex alignItems="center" key={item.id}>
                        <MenuCard dish={item} isLast={true} flexGrow={1} />;
                        <Button onClick={() => deletItem(parentCategory, item.id)}>Delete</Button>
                        <ItemModal
                            submitItem={(values) => editItemLocal(parentCategory, item.id, values)}
                            mode="Edit"
                            initialValues={{
                                name: item.name,
                                description: item.description,
                                label: item.label,
                                price: item.price
                            }}
                        />
                    </Flex>
                );
            })}
        </div>
    );
};
