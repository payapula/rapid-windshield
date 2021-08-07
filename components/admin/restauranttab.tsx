import {
    Box,
    Button,
    Flex,
    Modal,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel
} from '@chakra-ui/react';
import { InputField } from 'components/form/inputfield';
import React from 'react';
import { Form } from 'react-final-form';
import { useFirestore } from 'reactfire';
import { isEmpty } from 'utils/utils';
import { mustBeNumber, minValue, maxValue } from 'utils/validations';
import { v4 as uuidv4 } from 'uuid';
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon
} from '@chakra-ui/react';
import { cloneDeep, forEach, keys, map, omit, reduce, some } from 'lodash';
import { Dish, Restaurant } from 'types/restaurant';
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

interface RestaurantTabProps {
    restaurant?: Restaurant;
    dishes?: Dish[];
}

export const RestaurantTab = (props: RestaurantTabProps): JSX.Element => {
    const { restaurant, dishes } = props;
    const firestore = useFirestore();
    const [restaurantDetails, setRestaurantDetails] = React.useState<Restaurant>();
    const [tab, setTab] = React.useState(0);
    const [restaurantTabInvalid, setRestaurantTabInvalid] = React.useState(false);

    const addRestaurantSubmit = async (values: AddRestaurantForm): Promise<void> => {
        try {
            const restaurantId = restaurant ? restaurant.id : uuidv4();
            const restaurantInfo = {
                id: restaurantId,
                ...values
            };
            setRestaurantDetails(restaurantInfo);
            setRestaurantTabInvalid(false);
            setTab(1);
        } catch (error) {
            throw new Error('Some Error happened');
        }
    };

    return (
        <Tabs index={tab} isFitted onChange={(index) => setTab(index)}>
            <TabList>
                <Tab>
                    <Text fontSize="xl" fontWeight="bold">
                        Restaurant Details
                    </Text>
                </Tab>
                <Tab isDisabled={restaurantTabInvalid}>
                    <Text fontSize="xl" fontWeight="bold">
                        Menu Details
                    </Text>
                </Tab>
            </TabList>

            <TabPanels>
                <TabPanel>
                    <AddRestaurantForm
                        addRestaurantSubmit={addRestaurantSubmit}
                        setRestaurantTabInvalid={setRestaurantTabInvalid}
                        restaurant={restaurant}
                    />
                </TabPanel>
                <TabPanel>
                    <AddMenu
                        firestore={firestore}
                        restaurantDetails={restaurantDetails || restaurant}
                        setTab={setTab}
                        dishes={dishes}
                    />
                </TabPanel>
            </TabPanels>
        </Tabs>
    );
};

const ManageRestaurantInput = (props) => {
    return <InputField {...props} mt={5} mb={5} size="lg" />;
};

const AddRestaurantForm = ({ addRestaurantSubmit, setRestaurantTabInvalid, restaurant }) => {
    return (
        <Box>
            <Form<AddRestaurantForm>
                onSubmit={addRestaurantSubmit}
                initialValues={restaurant ? restaurant : undefined}
                render={({ handleSubmit, invalid, submitting, modified, form }) => {
                    React.useEffect(() => {
                        if (some(modified, (x) => x)) {
                            setRestaurantTabInvalid(true);
                        } else {
                            setRestaurantTabInvalid(invalid);
                        }
                    }, [invalid, modified]);
                    return (
                        <form
                            onSubmit={(event) =>
                                handleSubmit(event).then(() => {
                                    // This is required to store the edited values
                                    // from Restaurant details tab into state and then
                                    // move to Second tab
                                    const modfiedFields = keys(modified);
                                    forEach(modfiedFields, (name) => {
                                        if (modified[name]) {
                                            form.resetFieldState(name as keyof AddRestaurantForm);
                                        }
                                    });
                                })
                            }>
                            <ManageRestaurantInput
                                name="name"
                                labelText="Retaurant Name"
                                isRequired
                            />
                            <ManageRestaurantInput
                                name="type"
                                labelText="Restaurant Type"
                                isRequired
                            />
                            <ManageRestaurantInput
                                name="location"
                                labelText="Location"
                                isRequired
                            />
                            <ManageRestaurantInput
                                name="rating"
                                labelText="Rating"
                                inputType="number"
                                validations={[mustBeNumber, minValue(0), maxValue(5)]}
                                isRequired
                            />
                            <ManageRestaurantInput
                                name="instagramUrl"
                                labelText="Instagram URL"
                                inputType="url"
                                isRequired
                            />
                            <ManageRestaurantInput
                                name="websiteUrl"
                                labelText="Website URL"
                                inputType="url"
                                isRequired
                            />
                            <ManageRestaurantInput name="imageUrl" labelText="Image URL" />
                            <Button type="submit" disabled={invalid || submitting}>
                                Save and Proceed
                            </Button>
                        </form>
                    );
                }}
            />
        </Box>
    );
};

const arrangeDishesByCategory = (dishes: Dish[]): Category => {
    if (dishes === null) {
        return;
    }

    return reduce(
        dishes,
        function (categoryObj, dish) {
            return {
                ...categoryObj,
                [dish.category]: {
                    ...categoryObj[dish.category],
                    [dish.id]: dish
                }
            };
        },
        {}
    );
};

interface AddMenuProps {
    firestore: firebase.default.firestore.Firestore;
    setTab: React.Dispatch<React.SetStateAction<number>>;
    restaurantDetails: Restaurant;
    dishes: Dish[];
}

const AddMenu = ({ firestore, restaurantDetails, setTab, dishes = null }: AddMenuProps) => {
    const [category, setCategory] = React.useState<Category>(() => arrangeDishesByCategory(dishes));

    // To Enable the Save Restaurant Button,
    // When Atleas one Item exists inside category
    let anItemExisits = false;
    forEach(category, (cat) => {
        forEach(cat, (dis) => {
            if (dis.id) {
                anItemExisits = true;
            }
        });
    });

    const saveRestaurant = async () => {
        try {
            const batch = firestore.batch();

            const restaurantId = restaurantDetails.id;
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
            <Button onClick={() => setTab(0)} variant="ghost">
                Previous
            </Button>
            <Button onClick={saveRestaurant} colorScheme="blue" isDisabled={!anItemExisits}>
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
                    <Flex alignItems="center" key={item.id}>
                        <ItemCard item={item} />
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
