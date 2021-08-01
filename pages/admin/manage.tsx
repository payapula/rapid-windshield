import { Box, Button, Spinner } from '@chakra-ui/react';
import AdminLayout from 'components/admin/admin.layout';
import { InputField } from 'components/form/inputfield';
import { Linkbutton } from 'components/linkbutton';
import { withAuthUser, AuthAction } from 'next-firebase-auth';
import { useRouter } from 'next/router';
import React from 'react';
import { Form } from 'react-final-form';
import { useFirestore } from 'reactfire';
import { required, mustBeNumber, minValue, maxValue } from 'utils/validations';
import { v4 as uuidv4 } from 'uuid';
interface AddRestaurantForm {
    name: string;
    type: string;
    location: string;
    rating: string;
    instagramUrl: string;
    websiteUrl: string;
    imageUrl: string;
}

const Manage = () => {
    const firestore = useFirestore();
    const router = useRouter();

    const addRestaurantSubmit = async (values: AddRestaurantForm): Promise<void> => {
        try {
            const restaurantId = uuidv4();
            await firestore
                .collection('restaurants')
                .doc(restaurantId)
                .set({
                    id: restaurantId,
                    ...values
                });
            router.push('/admin/list');
        } catch (error) {
            throw new Error('Some Error happened');
        }
    };

    return (
        <AdminLayout>
            <Linkbutton href="/">Go Home</Linkbutton>

            <Box>
                <Form<AddRestaurantForm>
                    onSubmit={addRestaurantSubmit}
                    render={({ handleSubmit, invalid, submitting }) => {
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
                                    Add Restaurant
                                </Button>
                            </form>
                        );
                    }}
                />
            </Box>
        </AdminLayout>
    );
};

export default withAuthUser({
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    LoaderComponent: Spinner
})(Manage);
