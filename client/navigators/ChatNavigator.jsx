import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Chat from '../screens/Chat';
import ChatOverview from '../screens/ChatOverview';

const ChatStack = createStackNavigator();

const ChatNavigator = () => {
    return (
        <ChatStack.Navigator initialRouteName='ChatMain' screenOptions={{headerStyle: {
            height: 128,
        }}}>
            <ChatStack.Screen name="ChatMain" component={ChatOverview}/>
            <ChatStack.Screen name="ChatDetails" component={Chat}/>
        </ChatStack.Navigator>
    );
};

export default ChatNavigator;