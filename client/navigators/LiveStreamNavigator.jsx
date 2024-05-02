import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import StreamsOverview from '../screens/StreamsOverview';
import Stream from '../screens/StreamView';
import StreamS from '../screens/StreamBroadcast';

const LiveStreamStack = createStackNavigator();

const LiveStreamNavigator = () => {

    const {currentUser} = useUser();




    return (
        <LiveStreamStack.Navigator initialRouteName="StreamS" screenOptions={{ headerShown: false }}>
            <LiveStreamStack.Screen name="StreamsOverview" component={StreamsOverview} />
            {/* <LiveStreamStack.Screen name="Stream" component={Stream} /> */}
            <LiveStreamStack.Screen name="StreamS" component={StreamS} />
        </LiveStreamStack.Navigator>
    );
};

export default LiveStreamNavigator;
