import React from 'react';
import { colors } from '../styles/utilities';
import { useUser } from '../contexts/UserContext';
import { TouchableOpacity } from 'react-native';
import { ChevronLeft, LogOut } from 'lucide-react-native';
import { createStackNavigator } from '@react-navigation/stack';

import Profile from '../screens/Profile/Profile';

const ProfileStack = createStackNavigator();

const ProfileNavigator = ({ navigation }) => {
    const { handleSignOut } = useUser();

    return (
        <ProfileStack.Navigator>
            <ProfileStack.Screen name="ProfileMain" component={Profile} />
        </ProfileStack.Navigator>
    );
};

export default ProfileNavigator;
