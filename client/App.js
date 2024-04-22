import React from 'react';

import { StatusBar, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Chat from './screens/Chat';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';

const Stack = createStackNavigator();

const AuthenticationStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

const ChatStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Chat" component={Chat} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

const RootNavigator = () => {
    return (
    
        <NavigationContainer>
            <StatusBar translucent={true} backgroundColor='transparent' barStyle={'dark-content'}/>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="AuthenticationStack" component={AuthenticationStack} />
                <Stack.Screen name="ChatStack" component={ChatStack} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default function App() {
    return <RootNavigator />;
}
