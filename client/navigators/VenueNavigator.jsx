import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Venues from '../screens/Venues/Venues';
import VenueDetails from '../screens/Venues/VenueDetails';
import ShowDetails from '../screens/Venues/ShowDetails';

const VenueStack = createStackNavigator();

const VenueNavigator = () => {
    return (
        <VenueStack.Navigator initialRouteName="VenuesOverview" screenOptions={{ headerShown: false }}>
            <VenueStack.Screen name="VenuesOverview" component={Venues} />
            <VenueStack.Screen name="VenueDetails" component={VenueDetails} />
            <VenueStack.Screen name="ShowDetails" component={ShowDetails} />
        </VenueStack.Navigator>
    );
};

export default VenueNavigator;
