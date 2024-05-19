import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

import Welcome from '../screens/Auth/Welcome/Welcome';
import UserRole from '../screens/Auth/UserRole/UserRole';
import UserInfo from '../screens/Auth/UserInfo/UserInfo';
import Authentication from '../screens/Auth/Authentication/Authentication';

const AuthStack = createStackNavigator();

const AuthenticationStack = () => {
    return (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="Welcome" component={Welcome} />
            <AuthStack.Screen
                name="Authentication"
                component={Authentication}
                options={{ cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }}
            />
            <AuthStack.Screen
                name="UserRole"
                component={UserRole}
                options={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }}
            />
            <AuthStack.Screen
                name="UserInfo"
                component={UserInfo}
                options={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }}
            />
        </AuthStack.Navigator>
    );
};

export default AuthenticationStack;
