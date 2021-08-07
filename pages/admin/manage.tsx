import {
    Box,
    Button,
    Flex,
    FormLabel,
    Modal,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Spinner,
    Text,
    useDisclosure,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel
} from '@chakra-ui/react';
import AdminLayout from 'components/admin/admin.layout';
import { InputField } from 'components/form/inputfield';
import { Linkbutton } from 'components/linkbutton';
import { withAuthUser, AuthAction } from 'next-firebase-auth';
import { useRouter } from 'next/router';
import React from 'react';
import { Form } from 'react-final-form';
import { useFirestore } from 'reactfire';
import { isEmpty } from 'utils/utils';
import { required, mustBeNumber, minValue, maxValue } from 'utils/validations';
import { v4 as uuidv4 } from 'uuid';
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon
} from '@chakra-ui/react';
import { cloneDeep, forEach, isNil, map, omit } from 'lodash';
import { Dish, FOODLABEL, Restaurant } from 'types/restaurant';
import { MenuCard } from 'components/restaurant-page/menu-panel';

interface AddRestaurantForm {
    name: string;
    type: string;
    location: string;
    rating: string;
    instagramUrl: string;
    websiteUrl: string;
    imageUrl: string;
}

interface Category {
    [key: string]: Items;
}

interface Items {
    [key: string]: Dish;
}

const Manage = (): JSX.Element => {
    const firestore = useFirestore();
    // const router = useRouter();
    const [restaurantDetails, setRestaurantDetails] = React.useState<Restaurant>();
    const [tab, setTab] = React.useState(0);
    const [restaurantTabInvalid, setRestaurantTabInvalid] = React.useState(false);

    const addRestaurantSubmit = async (values: AddRestaurantForm): Promise<void> => {
        try {
            const restaurantId = uuidv4();
            const restaurantInfo = {
                id: restaurantId,
                ...values
            };
            setRestaurantDetails(restaurantInfo);
            setTab(1);
        } catch (error) {
            throw new Error('Some Error happened');
        }
    };

    return (
        <AdminLayout>
            <Linkbutton href="/">Go Home</Linkbutton>
            <Tabs index={tab} onChange={(index) => setTab(index)} isFitted>
                <TabList>
                    <Tab>Restaurant Details</Tab>
                    <Tab isDisabled={restaurantTabInvalid}>Menu Details</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <AddRestaurantForm
                            addRestaurantSubmit={addRestaurantSubmit}
                            setRestaurantTabInvalid={setRestaurantTabInvalid}
                        />
                    </TabPanel>
                    <TabPanel>
                        <AddMenu
                            firestore={firestore}
                            restaurantDetails={restaurantDetails}
                            // category={category} setCategory={setCategory}
                            setTab={setTab}
                        />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </AdminLayout>
    );
};

const AddRestaurantForm = ({ addRestaurantSubmit, setRestaurantTabInvalid }) => {
    return (
        <Box>
            <Form<AddRestaurantForm>
                onSubmit={addRestaurantSubmit}
                render={({ handleSubmit, invalid, submitting }) => {
                    setRestaurantTabInvalid(invalid);
                    return (
                        <form onSubmit={handleSubmit}>
                            <InputField
                                name="name"
                                placeHolder="Retaurant Name"
                                validations={[required]}
                            />
                            <InputField
                                name="type"
                                placeHolder="Restaurant Type"
                                validations={[required]}
                            />
                            <InputField
                                name="location"
                                placeHolder="Location"
                                validations={[required]}
                            />
                            <InputField
                                name="rating"
                                placeHolder="Rating"
                                inputType="number"
                                validations={[required, mustBeNumber, minValue(0), maxValue(5)]}
                            />
                            <InputField
                                name="instagramUrl"
                                placeHolder="Instagram URL"
                                inputType="url"
                                validations={[required]}
                            />
                            <InputField
                                name="websiteUrl"
                                placeHolder="Website URL"
                                inputType="url"
                                validations={[required]}
                            />
                            <InputField name="imageUrl" placeHolder="Image URL" />
                            <Button type="submit" disabled={invalid || submitting}>
                                Next, Add Menu
                            </Button>
                        </form>
                    );
                }}
            />
        </Box>
    );
};

// const category : Category = {
//     Morning: {
//         '1': {
//             available: 'true',
//         }
//     }
// }

// items
//  {morning: { 1: {...details }, 2: { ...details } }, evening: {}, night: {}}
//
//
const initialData = {
    Morning: {
        'ea31711b-e998-486e-94f9-71544313911f': {
            name: 'Dosa',
            description: 'sdf',
            label: FOODLABEL.VEG,
            price: 23,
            id: 'ea31711b-e998-486e-94f9-71544313911f',
            category: 'Morning',
            available: true
        },
        '5551450e-3358-4b47-8386-f3e8b0af1fcb': {
            name: 'Idly',
            description: 'sdf',
            label: FOODLABEL.VEG,
            price: 66,
            id: '5551450e-3358-4b47-8386-f3e8b0af1fcb',
            category: 'Morning',
            available: true
        }
    }
};

interface AddMenuProps {
    firestore: firebase.default.firestore.Firestore;
    // category:Category;
    // setCategory: React.Dispatch<React.SetStateAction<Category>>;
    setTab: React.Dispatch<React.SetStateAction<number>>;
    restaurantDetails: Restaurant;
}

const AddMenu = ({
    firestore,
    restaurantDetails
}: // category,
// setCategory
AddMenuProps) => {
    const [category, setCategory] = React.useState<Category>();

    const addSubCollectionMenu = async () => {
        try {
            const batch = firestore.batch();

            const restaurantId = uuidv4();
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
            console.log(JSON.stringify(error));
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
            <AddCategoryModal submit={addCategory} />
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
            {/* <Button
                onClick={() => {
                    setTab(1);
                }}
                colorScheme="gray">
                Previous
            </Button> */}
            <Button onClick={addSubCollectionMenu} colorScheme="blue">
                Save Restaurant
            </Button>
        </Box>
    );
};

interface CategoryAccordionProps {
    category: Category;
    deleteCategory: (category: string) => void;
    addItemsToCategory: (category: string, item: any) => void;
    deletItem: (categoryId: string, id: string) => void;
    editItem: (categoryId: string, id: string, updatedItem: any) => void;
    editCategory: (categoryId: string, newName: string) => void;
}

const CategoryAccordion = ({
    category,
    editCategory,
    deleteCategory,
    addItemsToCategory,
    deletItem,
    editItem
}: CategoryAccordionProps) => {
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
                                <AddCategoryModal
                                    submit={(name) => editCategory(catergoryKey, name)}
                                    mode="Edit"
                                    initialValues={{
                                        categoryName: catergoryKey
                                    }}
                                />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                            <AddItems
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

interface AddItemsProps {
    parentCategory: string;
    items: Items;
    addItemsToCategory: (category: string, item: any) => void;
    deletItem: (categoryId: string, id: string) => void;
    editItem: (categoryId: string, id: string, updatedItem: any) => void;
}

const AddItems = ({
    parentCategory,
    items,
    addItemsToCategory,
    deletItem,
    editItem
}: AddItemsProps) => {
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
            <AddEditItemModel submitItem={addItem} />
            {map(items, (item) => {
                return (
                    <Flex alignItems="center">
                        <ItemCard key={item.id} item={item} />
                        <Button onClick={() => deletItem(parentCategory, item.id)}>Delete</Button>
                        <AddEditItemModel
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

const ItemCard = ({ item }: { item: Dish }) => {
    return <MenuCard dish={item} isLast={true} flexGrow={1} />;
};

interface AddEditItemModalFields {
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

const AddEditItemModel = ({
    submitItem,
    mode = 'Add',
    initialValues = null
}: AddEditItemModelProps) => {
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
                closeOnEsc={false}
                initialFocusRef={initialRef}>
                <ModalOverlay />
                <ModalContent margin="auto">
                    <ModalHeader>Item Details</ModalHeader>
                    <ModalCloseButton />
                    <Form<AddEditItemModalFields>
                        onSubmit={onSubmit}
                        initialValues={initialValues}
                        render={({ handleSubmit, invalid }) => {
                            return (
                                <form onSubmit={handleSubmit}>
                                    <FormLabel>Item Name</FormLabel>
                                    <InputField
                                        name="name"
                                        placeHolder="Item Name"
                                        validations={[required]}
                                        ref={initialRef}
                                    />
                                    <FormLabel>Description</FormLabel>
                                    <InputField
                                        name="description"
                                        placeHolder="Good Fried Rice"
                                        validations={[required]}
                                    />
                                    <FormLabel>Label</FormLabel>
                                    <InputField
                                        name="label"
                                        placeHolder="Veg / Non Veg"
                                        validations={[required]}
                                    />
                                    <FormLabel>Price</FormLabel>
                                    <InputField
                                        name="price"
                                        placeHolder="20"
                                        inputType="number"
                                        validations={[required]}
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

const AddCategoryModal = ({ submit, mode = 'Add', initialValues = null }) => {
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
                closeOnEsc={false}
                initialFocusRef={initialRef}>
                <ModalOverlay />
                <ModalContent margin="auto">
                    <ModalHeader>Category Name</ModalHeader>
                    <ModalCloseButton />
                    <Form<{ categoryName: string }>
                        onSubmit={onSubmit}
                        initialValues={initialValues}
                        render={({ handleSubmit, invalid }) => {
                            return (
                                <form onSubmit={handleSubmit}>
                                    <FormLabel>Category Name</FormLabel>
                                    <InputField
                                        name="categoryName"
                                        placeHolder="Category Name"
                                        validations={[required]}
                                        ref={initialRef}
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

export default Manage;

// export default withAuthUser({
//     whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
//     whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
//     LoaderComponent: Spinner
// })(Manage);
