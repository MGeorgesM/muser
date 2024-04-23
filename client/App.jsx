import React from 'react';

import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { UserProvider, useUser } from './contexts/UserContext';
import { RegisterProvider } from './contexts/RegisterContext';

import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import MainTabs from './screens/MainTabs';
import UserRole from './screens/UserRole';
import userInfo from './screens/UserInfo';

const Stack = createStackNavigator();

const AuthenticationStack = () => {
    return (
        <RegisterProvider>
            <Stack.Navigator>
                <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
                <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
                <Stack.Screen name="UserRole" component={UserRole} options={{ headerShown: false }} />
                <Stack.Screen name="UserInfo" component={userInfo} options={{ headerShown: false }} />
            </Stack.Navigator>
        </RegisterProvider>
    );
};

const AppNavigator = () => {
    const { currentUser } = useUser();

    return currentUser ? <MainTabs /> : <AuthenticationStack />;
};

const App = () => {
    return (
        <NavigationContainer>
            <UserProvider>
                <StatusBar translucent={true} backgroundColor="transparent" barStyle={'dark-content'} />
                <AppNavigator />
            </UserProvider>
        </NavigationContainer>
    );
};

export default App;