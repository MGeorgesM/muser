import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Welcome from '../screens/Authentication/Welcome';
import UserRole from '../screens/Authentication/UserRole';
import UserInfo from '../screens/Authentication/UserInfo';
import Authentication from '../screens/Authentication/Authentication';

const AuthStack = createStackNavigator();

const AuthenticationStack = () => {
    return (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="Welcome" component={Welcome} />
            <AuthStack.Screen name="Authentication" component={Authentication} />
            <AuthStack.Screen name="UserRole" component={UserRole} />
            <AuthStack.Screen name="UserInfo" component={UserInfo} />
        </AuthStack.Navigator>
    );
};

export default AuthenticationStack;
