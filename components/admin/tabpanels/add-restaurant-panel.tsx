import {
    Box,
    Button,
    Flex,
    FormControl,
    FormHelperText,
    FormLabel,
    Input,
    Progress,
    Spinner,
    Icon
} from '@chakra-ui/react';
import React from 'react';
import { Form } from 'react-final-form';
import { mustBeNumber, minValue, maxValue } from 'utils/validations';
import { forEach, keys, some } from 'lodash';
import { ManageRestaurantInput } from '../manage-restaurant-input';
import { AddRestaurantForm, Restaurant } from 'types/restaurant';
import { useStorage, useStorageTask } from 'reactfire';
import 'firebase/storage';
import { RestaurantImage } from 'components/restaurant-image';
import { useRapidToast } from 'utils/hooks';

import { GrFormNextLink } from 'react-icons/gr';

interface AddRestaurantPanelProps {
    addRestaurantSubmit: (values: any) => Promise<void>;
    setRestaurantTabInvalid: React.Dispatch<React.SetStateAction<boolean>>;
    restaurant: Restaurant;
    setRestaurantImage: React.Dispatch<React.SetStateAction<string>>;
    restaurantImage: string;
}

export const AddRestaurantPanel = ({
    addRestaurantSubmit,
    setRestaurantTabInvalid,
    restaurant,
    setRestaurantImage,
    restaurantImage
}: AddRestaurantPanelProps): JSX.Element => {
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
                            <Flex
                                direction="column"
                                justifyContent="space-between"
                                alignItems="center">
                                <Box w="60%">
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
                                        name="phone"
                                        labelText="Contact Number"
                                        isRequired
                                    />
                                    <ManageRestaurantInput
                                        name="instagramUrl"
                                        labelText="Instagram URL"
                                        inputType="url"
                                    />
                                    <ManageRestaurantInput
                                        name="websiteUrl"
                                        labelText="Website URL"
                                        inputType="url"
                                    />
                                    <RestaurantLogoUpload
                                        setRestaurantImage={setRestaurantImage}
                                        restaurant={restaurant}
                                        restaurantImage={restaurantImage}
                                    />
                                    <ManageRestaurantInput
                                        name="about"
                                        labelText="About Restaurant"
                                        inputType="textarea"
                                        variant="outline"
                                    />
                                </Box>

                                <Box mt="10">
                                    <Button
                                        type="submit"
                                        h="12"
                                        colorScheme="blue"
                                        disabled={invalid || submitting}
                                        rightIcon={<Icon as={GrFormNextLink} w={6} h={6} />}>
                                        Save and Proceed
                                    </Button>
                                </Box>
                            </Flex>
                        </form>
                    );
                }}
            />
        </Box>
    );
};

const RestaurantLogoUpload = ({ setRestaurantImage, restaurant, restaurantImage }) => {
    const [uploadTask, setUploadTask] = React.useState<
        firebase.default.storage.UploadTask | undefined
    >(undefined);
    const [ref, setRef] = React.useState<firebase.default.storage.Reference | undefined>(undefined);
    const storage = useStorage();
    const toast = useRapidToast();

    const onFileUploadChange = (event) => {
        const fileList = event.target.files;
        const fileToUpload = fileList[0];
        const fileName = fileToUpload.name;
        const newRef = storage.ref('images').child(fileName);
        setRef(newRef);

        const uploadTask = newRef.put(fileToUpload);

        uploadTask
            .then(() => {
                newRef.getDownloadURL().then((url) => {
                    setRestaurantImage(url);
                });
            })
            .catch((error) => {
                // eslint-disable-next-line no-console
                console.log(error);
                toast({
                    title: 'Upload Failed',
                    description: 'Unable to upload the File. Please check File Properties',
                    status: 'error',
                    duration: 5000,
                    isClosable: true
                });
                setUploadTask(undefined);
            });
        setUploadTask(uploadTask);
    };

    return (
        <>
            <FormControl>
                <FormLabel htmlFor="restaurant-upload" color="pink.600" fontSize="xl">
                    Image Upload
                </FormLabel>
                {restaurantImage ? (
                    <RestaurantImage imageUrl={restaurantImage} restaurantName={restaurant.name} />
                ) : restaurant ? (
                    <RestaurantImage
                        imageUrl={restaurant.imageUrl}
                        restaurantName={restaurant.name}
                    />
                ) : (
                    <></>
                )}
                <Input
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    id="restaurant-upload"
                    onChange={onFileUploadChange}
                />
                <FormHelperText>Upload Images less than 1MB.</FormHelperText>
                <FormHelperText>Formats: jpg, png, jpeg</FormHelperText>
            </FormControl>
            {uploadTask && <UploadProgress uploadTask={uploadTask} storageRef={ref} />}
        </>
    );
};

const UploadProgress = ({ uploadTask, storageRef }) => {
    const { status, data: uploadProgress } = useStorageTask(uploadTask, storageRef);

    if (status === 'loading') {
        return <Spinner />;
    }

    const { bytesTransferred, totalBytes } =
        uploadProgress as firebase.default.storage.UploadTaskSnapshot;

    const percentComplete = Math.round(100 * (bytesTransferred / totalBytes));
    return <Progress colorScheme="pink" size="lg" hasStripe value={percentComplete} />;
};
