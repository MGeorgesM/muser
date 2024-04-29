import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Venues from '../screens/Venues';
import VenueDetails from '../screens/VenueDetails';
import ShowDetails from '../screens/ShowDetails';

const VenueStack = createStackNavigator();

const VenueNavigator = () => {
    return (
        <VenueStack.Navigator initialRouteName="BookingDetails" screenOptions={{ headerShown: false }}>
            <VenueStack.Screen name="VenuesOverview" component={Venues} />
            <VenueStack.Screen name="VenueDetails" component={VenueDetails} />
            <VenueStack.Screen name="ShowDetails" component={ShowDetails} />
        </VenueStack.Navigator>
    );
};

export default VenueNavigator;
