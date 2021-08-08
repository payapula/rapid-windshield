import {
    Button,
    Modal,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    useDisclosure
} from '@chakra-ui/react';
import { AddEditButton } from 'components/form/buttons';
import React from 'react';
import { Form } from 'react-final-form';
import { ManageRestaurantInput } from '../manage-restaurant-input';
import { GrFormEdit, GrFormAdd } from 'react-icons/gr';
import { Icon } from '@chakra-ui/react';

export interface AddEditItemModalFields {
    name: string;
    description: string;
    label: string;
    price: number;
}

interface AddEditItemModelProps {
    submitItem: (values: AddEditItemModalFields, catergoryKey: string) => void;
    mode?: 'Add' | 'Edit';
    initialValues?: AddEditItemModalFields;
    catergoryKey: string;
}

export const ItemModal = ({
    submitItem,
    mode = 'Add',
    initialValues = null,
    catergoryKey
}: AddEditItemModelProps): JSX.Element => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const isEdit = mode === 'Edit';

    const onSubmit = (values: AddEditItemModalFields) => {
        onClose();
        submitItem(values, catergoryKey);
    };

    const initialRef = React.useRef();

    return (
        <>
            <AddEditButton
                isEdit={isEdit}
                onClick={onOpen}
                leftIcon={!isEdit && <Icon as={GrFormAdd} w={6} h={6} />}>
                {isEdit ? <Icon as={GrFormEdit} w={6} h={6} color="white" /> : 'New Dish'}
            </AddEditButton>

            <Modal
                isOpen={isOpen}
                onClose={onClose}
                closeOnOverlayClick={false}
                initialFocusRef={initialRef}>
                <ModalOverlay />
                <ModalContent margin="auto">
                    <ModalHeader>Add New Item</ModalHeader>
                    <ModalCloseButton />
                    <Form<AddEditItemModalFields>
                        onSubmit={onSubmit}
                        initialValues={initialValues}
                        render={({ handleSubmit, invalid }) => {
                            return (
                                <form onSubmit={handleSubmit}>
                                    <ManageRestaurantInput
                                        name="name"
                                        labelText="Item Name"
                                        isRequired
                                        ref={initialRef}
                                        size="lg"
                                    />
                                    <ManageRestaurantInput
                                        name="description"
                                        labelText="Description"
                                        isRequired
                                        size="lg"
                                    />
                                    <ManageRestaurantInput
                                        name="label"
                                        labelText="Veg / Non Veg"
                                        isRequired
                                        size="lg"
                                    />

                                    <ManageRestaurantInput
                                        name="price"
                                        labelText="Price"
                                        inputType="number"
                                        isRequired
                                        size="lg"
                                    />
                                    <Button type="submit" disabled={invalid}>
                                        {isEdit ? 'Save' : 'Add'}
                                    </Button>
                                </form>
                            );
                        }}
                    />
                </ModalContent>
            </Modal>
        </>
    );
};
