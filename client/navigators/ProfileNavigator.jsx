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
        <ProfileStack.Navigator
            screenOptions={{
                headerTitle: 'Profile',
                headerStyle: {
                    backgroundColor: colors.bgDarkest,
                    shadowColor: 'transparent',
                    elevation: 0,
                    height: 128,
                },

                headerTitleStyle: {
                    fontFamily: 'Montserrat-Regular',
                    color: colors.white,
                    fontSize: 20,
                },

                headerLeft: () => (
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 20 }}>
                        <ChevronLeft size={24} color="white" />
                    </TouchableOpacity>
                ),

                headerRight: () => (
                    <TouchableOpacity onPress={() => handleSignOut(navigation)}>
                        <LogOut size={24} color={'white'} style={{ marginEnd: 20 }} />
                    </TouchableOpacity>
                ),
            }}
        >
            <ProfileStack.Screen name="ProfileMain" component={Profile} />
        </ProfileStack.Navigator>
    );
};

export default ProfileNavigator;