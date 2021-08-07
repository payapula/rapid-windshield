import {
    Button,
    Modal,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    useDisclosure
} from '@chakra-ui/react';
import { InputField } from 'components/form/inputfield';
import React from 'react';
import { Form } from 'react-final-form';

interface CategoryModalProps {
    submit: (categoryName: any) => void;
    mode?: 'Add' | 'Edit';
    initialValues?: unknown;
}

export const CategoryModal = ({
    submit,
    mode = 'Add',
    initialValues = null
}: CategoryModalProps): JSX.Element => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const isEdit = mode === 'Edit';

    const onSubmit = ({ categoryName }) => {
        onClose();
        submit(categoryName);
    };

    const initialRef = React.useRef();

    return (
        <>
            <Button onClick={onOpen}>{isEdit ? 'Edit' : 'Add Category'}</Button>

            <Modal
                isOpen={isOpen}
                onClose={onClose}
                closeOnOverlayClick={false}
                initialFocusRef={initialRef}>
                <ModalOverlay />
                <ModalContent margin="auto">
                    <ModalHeader>Add New Category</ModalHeader>
                    <ModalCloseButton />
                    <Form<{ categoryName: string }>
                        onSubmit={onSubmit}
                        initialValues={initialValues}
                        render={({ handleSubmit, invalid }) => {
                            return (
                                <form onSubmit={handleSubmit}>
                                    <InputField
                                        name="categoryName"
                                        labelText="Category Name"
                                        isRequired
                                        ref={initialRef}
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
