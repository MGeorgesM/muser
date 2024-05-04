import React, { useEffect } from 'react';
import { Platform, StatusBar, PermissionsAndroid } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import { store } from './store/store';
import { Provider } from 'react-redux';
import { UserProvider, useUser } from './contexts/UserContext';

import Authentication from './screens/Authentication';
import MainTabs from './screens/MainTabs';
import UserRole from './screens/UserRole';
import UserInfo from './screens/UserInfo';
import Welcome from './screens/Welcome';

// import {utilities, colors} from '../styles/utilities';

const Stack = createStackNavigator();

const AuthenticationStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="Authentication" component={Authentication} />
            <Stack.Screen name="UserRole" component={UserRole} />
            <Stack.Screen name="UserInfo" component={UserInfo} />
        </Stack.Navigator>
    );
};

const AppNavigator = () => {
    const { loggedIn } = useUser();

    return loggedIn ? <MainTabs /> : <AuthenticationStack />;
};

const App = () => {
    useEffect(() => {
        const run = async () => {
            if (Platform.OS === 'android') {
                await PermissionsAndroid.requestMultiple([
                    'android.permission.POST_NOTIFICATIONS',
                    'android.permission.BLUETOOTH_CONNECT',
                ]);
            }
        };
        run();
    }, []);
    return (
        <Provider store={store}>
            <NavigationContainer>
                <UserProvider>
                    <StatusBar translucent={true} backgroundColor="transparent" barStyle={'light-content'} />
                    <AppNavigator />
                </UserProvider>
            </NavigationContainer>
        </Provider>
    );
};

export default App;
