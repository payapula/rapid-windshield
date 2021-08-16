import { Button, Flex } from '@chakra-ui/react';
import React from 'react';
import { map } from 'lodash';
import { Dish, Items } from 'types/restaurant';
import { MenuCard } from 'components/restaurant-page/menu-panel';
import { AddEditItemModalFields, ItemModal } from './modals/item-modal';
import { DangerButton } from 'components/form/buttons';
import { GrCheckbox, GrCheckboxSelected, GrFormTrash } from 'react-icons/gr';
import { Icon } from '@chakra-ui/react';

interface ItemsListProps {
    parentCategory: string;
    items: Items;
    deletItem: (categoryId: string, id: string) => void;
    editItem: (categoryId: string, id: string, updatedItem: any) => void;
}

export const ItemsList = ({
    parentCategory,
    items,
    deletItem,
    editItem
}: ItemsListProps): JSX.Element => {
    const editItemLocal = (
        parentCategory: string,
        itemId: string,
        values: AddEditItemModalFields
    ) => {
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
            {/* <pre>{JSON.stringify(items, null, 2)}</pre> */}
            {map(items, (item) => {
                return (
                    <Flex alignItems="center" key={item.id} opacity={item.enabled ? '1' : '0.3'}>
                        <EnableDisableItem
                            editItem={editItem}
                            item={item}
                            parentCategory={parentCategory}
                        />
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

interface EnableDisableItemProps {
    editItem: (categoryId: string, id: string, updatedItem: any) => void;
    item: Dish;
    parentCategory: string;
}

const EnableDisableItem = ({ editItem, item, parentCategory }: EnableDisableItemProps) => {
    const [enabled, setEnabled] = React.useState<boolean>(!!item.enabled);

    React.useEffect(() => {
        if (item.enabled !== enabled) {
            const editedData = {
                ...item,
                enabled
            };

            editItem(parentCategory, item.id, editedData);
        }
    }, [enabled]);

    return (
        <Button
            onClick={() => {
                setEnabled((s) => !s);
            }}
            mt="1"
            mr="2"
            w={10}
            h={10}
            backgroundColor="transparent"
            borderRadius="50%">
            {enabled ? (
                <Icon as={GrCheckboxSelected} w={6} h={6} />
            ) : (
                <Icon as={GrCheckbox} w={6} h={6} />
            )}
        </Button>
    );
};
