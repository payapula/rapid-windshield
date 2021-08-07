import {
    Button,
    Modal,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    useDisclosure
} from '@chakra-ui/react';
import React from 'react';
import { Form } from 'react-final-form';
import { ManageRestaurantInput } from '../manage-restaurant-input';

export interface AddEditItemModalFields {
    name: string;
    description: string;
    label: string;
    price: number;
}

interface AddEditItemModelProps {
    submitItem: (values: AddEditItemModalFields) => void;
    mode?: 'Add' | 'Edit';
    initialValues?: AddEditItemModalFields;
}

export const ItemModal = ({
    submitItem,
    mode = 'Add',
    initialValues = null
}: AddEditItemModelProps): JSX.Element => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const isEdit = mode === 'Edit';

    const onSubmit = (values: AddEditItemModalFields) => {
        onClose();
        submitItem(values);
    };

    const initialRef = React.useRef();

    return (
        <>
            <Button onClick={onOpen}>{isEdit ? 'Edit' : 'Add New Item'}</Button>

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
