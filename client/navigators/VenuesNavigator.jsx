import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Venues from '../screens/Venues/VenuesMain/Venues';
import VenueDetails from '../screens/Venues/VenueDetails/VenueDetails';
import ShowDetails from '../screens/Venues/ShowDetails/ShowDetails';

const VenuesStack = createStackNavigator();

const VenuesNavigator = () => {
    return (
        <VenuesStack.Navigator initialRouteName="VenuesOverview" screenOptions={{ headerShown: false }}>
            <VenuesStack.Screen name="VenuesOverview" component={Venues} />
            <VenuesStack.Screen name="VenueDetails" component={VenueDetails} />
            <VenuesStack.Screen name="ShowDetails" component={ShowDetails} />
        </VenuesStack.Navigator>
    );
};

export default VenuesNavigator;
