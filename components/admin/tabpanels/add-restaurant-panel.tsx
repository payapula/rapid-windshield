import { Box, Button } from '@chakra-ui/react';
import React from 'react';
import { Form } from 'react-final-form';
import { mustBeNumber, minValue, maxValue } from 'utils/validations';
import { forEach, keys, some } from 'lodash';
import { ManageRestaurantInput } from '../manage-restaurant-input';
import { Restaurant } from 'types/restaurant';

interface AddRestaurantForm {
    name: string;
    type: string;
    location: string;
    rating: string;
    instagramUrl: string;
    websiteUrl: string;
    imageUrl: string;
}

interface AddRestaurantPanelProps {
    addRestaurantSubmit: (values: any) => Promise<void>;
    setRestaurantTabInvalid: React.Dispatch<React.SetStateAction<boolean>>;
    restaurant: Restaurant;
}

export const AddRestaurantPanel = ({
    addRestaurantSubmit,
    setRestaurantTabInvalid,
    restaurant
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
