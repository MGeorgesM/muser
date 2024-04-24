import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Feed from '../screens/Feed';
import ProfileDetails from '../screens/ProfileDetails';

const FeedStack = createStackNavigator();

const FeedNavigator = () => {
    return (
        <FeedStack.Navigator screenOptions={{headerStyle: {
            height: 128,
        }}}>
            <FeedStack.Screen name="Feed" component={Feed}/>
            <FeedStack.Screen name="ProfileDetails" component={ProfileDetails} options={{ headerShown: false }} />
        </FeedStack.Navigator>
    );
};

export default FeedNavigator;