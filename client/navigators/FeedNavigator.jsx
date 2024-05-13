import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Feed from '../screens/Feed/Feed';
import ProfileDetails from '../screens/Feed/ProfileDetails';

const FeedStack = createStackNavigator();

const FeedNavigator = () => {
    return (
        <FeedStack.Navigator initialRouteName='FeedMain' screenOptions={{headerStyle: {
            height: 128,
        }}}>
            <FeedStack.Screen name="FeedMain" component={Feed}/>
            <FeedStack.Screen name="ProfileDetails" component={ProfileDetails} options={{ headerShown: false }} />
        </FeedStack.Navigator>
    );
};

export default FeedNavigator;