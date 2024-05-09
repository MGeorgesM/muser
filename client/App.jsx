import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import { store } from './store/store';
import { Provider } from 'react-redux';
import { UserProvider, useUser } from './contexts/UserContext';

import MainTabs from './screens/MainTabs';
import AuthenticationStack from './navigators/AuthNavigator';
import messaging from '@react-native-firebase/messaging';

const AppNavigator = () => {
    const { loggedIn } = useUser();
    return loggedIn ? <MainTabs /> : <AuthenticationStack />;
};

const App = () => {

    async function requestUserPermission() {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            console.log('Authorization status:', authStatus);
        }
    }

    const getToken = async () => {
        const token = await messaging().getToken();
        console.log('Token:', token);
    };

    useEffect(() => {
        requestUserPermission();
        getToken();
    },[]);

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
