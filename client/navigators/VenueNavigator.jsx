import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Venues from '../screens/Venues';
import VenueDetails from '../screens/VenueDetails';

const VenueStack = createStackNavigator();

const VenueNavigator = () => {
    return (
        <VenueStack.Navigator initialRouteName="VenuesOverview" screenOptions={{ headerShown: false }}>
            <VenueStack.Screen name="VenuesOverview" component={Venues} />
            <VenueStack.Screen name="VenueDetails" component={VenueDetails} />
        </VenueStack.Navigator>
    );
};

export default VenueNavigator;
