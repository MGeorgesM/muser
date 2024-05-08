import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import { store } from './store/store';
import { Provider } from 'react-redux';
import { UserProvider, useUser } from './contexts/UserContext';

import MainTabs from './screens/MainTabs';
import AuthenticationStack from './navigators/AuthNavigator'

const AppNavigator = () => {
    const { loggedIn } = useUser();
    return loggedIn ? <MainTabs /> : <AuthenticationStack />;
};

const App = () => {
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
