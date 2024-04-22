import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Chat from './screens/Chat';
import SignIn from './screens/SignIn';

const Stack = createStackNavigator();

const ChatStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Chat" component={SignIn} />
        </Stack.Navigator>
    );
};

const RootNavigator = () => {
    return (
        <NavigationContainer>
            <ChatStack />
        </NavigationContainer>
    );
};

export default function App() {
    return <RootNavigator />;
}
