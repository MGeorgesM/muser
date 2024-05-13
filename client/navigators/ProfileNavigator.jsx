import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import { useUser } from '../contexts/UserContext';

import Profile from '../screens/Profile/Profile';

import { colors } from '../styles/utilities';
import { ChevronLeft, LogOut } from 'lucide-react-native';

const ProfileStack = createStackNavigator();

const ProfileNavigator = ({ navigation }) => {
    const { handleSignOut } = useUser();

    return (
        <ProfileStack.Navigator
            screenOptions={{
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
                        <LogOut size={30} color={'white'} style={{ marginEnd: 20 }} />
                    </TouchableOpacity>
                ),
            }}
        >
            <ProfileStack.Screen name="ProfileMain" component={Profile} />
        </ProfileStack.Navigator>
    );
};

export default ProfileNavigator;

const styles = StyleSheet.create({});
