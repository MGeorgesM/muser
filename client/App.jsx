import React from 'react';

import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { UserProvider, useUser } from './contexts/UserContext';


import MainTabs from './screens/MainTabs';
import UserRole from './screens/UserRole';
import userInfo from './screens/UserInfo';
import Authentication from './screens/Authentication';

// const { utilities, colors } from './styles/utilities';

const Stack = createStackNavigator();

const AuthenticationStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Authentication" component={Authentication} options={{ headerShown: false }} />
            <Stack.Screen name="UserRole" component={UserRole} options={{ headerShown: false }} />
            <Stack.Screen name="UserInfo" component={userInfo} options={{ headerShown: false }} />
        </Stack.Navigator>
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
