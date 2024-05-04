import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { MessagesSquare, Store, Radio, AudioWaveform, UserRound } from 'lucide-react-native';

import FeedNavigator from '../navigators/FeedNavigator';
import ChatNavigator from '../navigators/ChatNavigator';
import Profile from './Profile';
import VenueNavigator from '../navigators/VenueNavigator';
import LiveStreamNavigator from '../navigators/LiveStreamNavigator';
import { colors } from '../styles/utilities';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
    return (
        <Tab.Navigator
            initialRouteName="Venues"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let IconComponent;

                    if (route.name === 'Chat') {
                        IconComponent = MessagesSquare;
                    } else if (route.name === 'Feed') {
                        IconComponent = AudioWaveform;
                    } else if (route.name === 'Live') {
                        IconComponent = Radio;
                    } else if (route.name === 'Venues') {
                        IconComponent = Store;
                    } else if (route.name === 'Profile') {
                        IconComponent = UserRound;
                    }

                    return <IconComponent color={color} size={24} />;
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.white,
                tabBarHideOnKeyboard: true,
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontFamily: 'Montserrat-Regular',
                    marginBottom: 10,
                },
                tabBarIconStyle: {
                    marginTop: 12,
                },
                tabBarStyle: {
                    height: 64,
                    backgroundColor: colors.bgDark,
                    borderColor: colors.lightGray,
                    borderTopWidth: 0.5,
                },
            })}
        >
            <Tab.Screen name="Venues" component={VenueNavigator} options={{ headerShown: false }} />
            <Tab.Screen name="Chat" component={ChatNavigator} options={{ headerShown: false }} />
            <Tab.Screen name="Feed" component={FeedNavigator} options={{ headerShown: false }} />
            <Tab.Screen name="Live" component={LiveStreamNavigator} options={{ headerShown: false }} />
            <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
    );
};

export default MainTabs;

const styles = StyleSheet.create({});
