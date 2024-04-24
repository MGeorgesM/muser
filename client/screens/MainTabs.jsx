import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MessagesSquare, Store, Radio, AudioWaveform, UserRound } from 'lucide-react-native';

import Profile from './Profile';
import Venues from './Venues';
import Chat from './Chat';
import Feed from './Feed';
import Live from './Live';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
    return (
        <Tab.Navigator
            initialRouteName="Feed"
            screenOptions={({ route }) => ({
                headerStyle: {
                    height: 128,
                },
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
                tabBarActiveTintColor: 'black',
                tabBarInactiveTintColor: 'gray',
                tabBarLabelStyle: {
                    fontSize: 12,
                    marginBottom: 12,
                },
                tabBarIconStyle: {
                    marginTop: 12,
                },
                tabBarStyle: {
                    height: 64,
                },
            })}
        >
            <Tab.Screen name="Venues" component={Venues} />
            <Tab.Screen name="Chat" component={Chat} />
            <Tab.Screen name="Feed" component={Feed} />
            <Tab.Screen name="Live" component={Live} />
            <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
    );
};

export default MainTabs;

const styles = StyleSheet.create({});
