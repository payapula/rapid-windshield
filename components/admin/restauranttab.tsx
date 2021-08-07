import { Text, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import React from 'react';
import { useFirestore } from 'reactfire';
import { v4 as uuidv4 } from 'uuid';
import { Dish, Restaurant } from 'types/restaurant';
import { AddMenuPanel } from './tabpanels/add-menu-panel';
import { AddRestaurantPanel } from './tabpanels/add-restaurant-panel';

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

    const addRestaurantSubmit = async (values): Promise<void> => {
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
                    <AddRestaurantPanel
                        addRestaurantSubmit={addRestaurantSubmit}
                        setRestaurantTabInvalid={setRestaurantTabInvalid}
                        restaurant={restaurant}
                    />
                </TabPanel>
                <TabPanel>
                    <AddMenuPanel
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
