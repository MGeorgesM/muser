import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import StreamsOverview from '../screens/StreamsOverview';
import Stream from '../screens/Stream';

const LiveStreamStack = createStackNavigator();

const LiveStreamNavigator = () => {
    return (
        <LiveStreamStack.Navigator initialRouteName="Stream" screenOptions={{ headerShown: false }}>
            <LiveStreamStack.Screen name="StreamsOverview" component={StreamsOverview} />
            <LiveStreamStack.Screen name="Stream" component={Stream} />
        </LiveStreamStack.Navigator>
    );
};

export default LiveStreamNavigator;
