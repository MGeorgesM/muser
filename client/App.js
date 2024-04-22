import React, { useState, useEffect } from 'react';
import { auth } from './config/firebase';

import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Chat from './screens/Chat';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import MainTabs from './screens/MainTabs';

const Stack = createStackNavigator();

const AuthenticationStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

// const ChatStack = () => {
//     return (
//         <Stack.Navigator>
//             <Stack.Screen name="Chat" component={Chat} />
//         </Stack.Navigator>
//     );
// };

// const RootNavigator = () => {
//     return (
//         <NavigationContainer>
//             <StatusBar translucent={true} backgroundColor="transparent" barStyle={'dark-content'} />

//             <Stack.Screen name="AuthenticationStack" component={AuthenticationStack} />

//             <MainTabs />
//         </NavigationContainer>
//     );
// };

export default function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            if(user) {
                console.log('User:', user);
            }
        });

        return unsubscribe;
    }, []);
    return (
        <NavigationContainer>
            <StatusBar translucent={true} backgroundColor="transparent" barStyle={'dark-content'} />
            {user ? <MainTabs /> : <AuthenticationStack />}
        </NavigationContainer>
    );
}
