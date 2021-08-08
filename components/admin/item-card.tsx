import { Flex } from '@chakra-ui/react';
import React from 'react';
import { map } from 'lodash';
import { Items } from 'types/restaurant';
import { MenuCard } from 'components/restaurant-page/menu-panel';
import { ItemModal } from './modals/item-modal';
import { DangerButton } from 'components/form/buttons';
import { GrFormTrash } from 'react-icons/gr';
import { Icon } from '@chakra-ui/react';

interface ItemCardProps {
    parentCategory: string;
    items: Items;
    deletItem: (categoryId: string, id: string) => void;
    editItem: (categoryId: string, id: string, updatedItem: any) => void;
}

export const ItemCard = ({
    parentCategory,
    items,
    deletItem,
    editItem
}: ItemCardProps): JSX.Element => {
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
            {map(items, (item) => {
                return (
                    <Flex alignItems="center" key={item.id}>
                        <MenuCard dish={item} isLast={true} flexGrow={1} />
                        <Flex w="8%" alignContent="space-around" direction="column" pl="2" pr="2">
                            <ItemModal
                                submitItem={(values, catergoryKey) =>
                                    editItemLocal(catergoryKey, item.id, values)
                                }
                                mode="Edit"
                                initialValues={{
                                    name: item.name,
                                    description: item.description,
                                    label: item.label,
                                    price: item.price
                                }}
                                catergoryKey={parentCategory}
                            />
                            <DangerButton onClick={() => deletItem(parentCategory, item.id)} mt="1">
                                <Icon as={GrFormTrash} w={6} h={6} />
                            </DangerButton>
                        </Flex>
                    </Flex>
                );
            })}
        </div>
    );
};
