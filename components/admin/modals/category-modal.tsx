import {
    Box,
    Button,
    Flex,
    Modal,
    ModalCloseButton,
    ModalContent,
    ModalOverlay,
    useDisclosure
} from '@chakra-ui/react';
import { AddEditButton } from 'components/form/buttons';
import { InputField } from 'components/form/inputfield';
import React from 'react';
import { Form } from 'react-final-form';
import { GrFormEdit, GrFormAdd } from 'react-icons/gr';
import { Icon } from '@chakra-ui/react';
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
            <Box textAlign="center">
                <AddEditButton
                    isEdit={isEdit}
                    onClick={onOpen}
                    mb={!isEdit ? '5' : 'initial'}
                    leftIcon={!isEdit && <Icon as={GrFormAdd} w={6} h={6} />}>
                    {isEdit ? (
                        <>
                            <Icon as={GrFormEdit} w={6} h={6} mr="2" /> Category
                        </>
                    ) : (
                        'New Category'
                    )}
                </AddEditButton>
            </Box>

            <Modal
                isOpen={isOpen}
                onClose={onClose}
                closeOnOverlayClick={false}
                initialFocusRef={initialRef}>
                <ModalOverlay />
                <ModalContent margin="auto" p="5">
                    <ModalCloseButton />
                    <Box mt="7">
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
                                        <Flex w="100%" justifyContent="center" h="10" mt="5">
                                            <Button
                                                type="submit"
                                                disabled={invalid}
                                                h="10"
                                                colorScheme="green">
                                                {isEdit ? 'Save' : 'Add'}
                                            </Button>
                                        </Flex>
                                    </form>
                                );
                            }}
                        />
                    </Box>
                </ModalContent>
            </Modal>
        </>
    );
};
