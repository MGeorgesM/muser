import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Chat from './screens/Chat';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';

const Stack = createStackNavigator();

const ChatStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="SignIn" component={SignIn} options={{headerShown:false}}/>
            <Stack.Screen name="SignUp" component={SignUp} options={{headerShown:false}}/>
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
