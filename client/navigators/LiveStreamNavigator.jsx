import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import StreamsOverview from '../screens/StreamsOverview';
import Stream from '../screens/Stream';
import StreamS from '../screens/StreamS';

const LiveStreamStack = createStackNavigator();

const LiveStreamNavigator = () => {
    return (
        <LiveStreamStack.Navigator initialRouteName="StreamS" screenOptions={{ headerShown: false }}>
            <LiveStreamStack.Screen name="StreamsOverview" component={StreamsOverview} />
            <LiveStreamStack.Screen name="Stream" component={Stream} />
            <LiveStreamStack.Screen name="StreamS" component={StreamS} />
        </LiveStreamStack.Navigator>
    );
};

export default LiveStreamNavigator;
