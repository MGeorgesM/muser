import React from 'react';

import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { store } from './store/store';
import { Provider } from 'react-redux';
import { UserProvider, useUser } from './contexts/UserContext';

import Authentication from './screens/Authentication';
import MainTabs from './screens/MainTabs';
import UserRole from './screens/UserRole';
import UserInfo from './screens/UserInfo';

// const { utilities, colors } from './styles/utilities';

const Stack = createStackNavigator();

const AuthenticationStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Authentication" component={Authentication} options={{ headerShown: false }} />
            <Stack.Screen name="UserRole" component={UserRole} options={{ headerShown: false }} />
            <Stack.Screen name="UserInfo" component={UserInfo} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

const AppNavigator = () => {
    const { loggedIn } = useUser();

    return loggedIn ? <MainTabs /> : <AuthenticationStack />;
};

const App = () => {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <UserProvider>
                    <StatusBar translucent={true} backgroundColor="transparent" barStyle={'dark-content'} />
                    <AppNavigator />
                </UserProvider>
            </NavigationContainer>
        </Provider>
    );
};

export default App;
