import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MessagesSquare, Store, Radio, AudioWaveform, UserRound } from 'lucide-react-native';

import Chat from './Chat';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let IconComponent;

                    if (route.name === 'Chat') {
                        IconComponent = MessagesSquare;
                    } else if (route.name === 'SignIn') {
                        IconComponent = UserRound;
                    } else if (route.name === 'SignUp') {
                        IconComponent = Store;
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
            <Tab.Screen name="Chat" component={Chat} />
        </Tab.Navigator>
    );
};

export default MainTabs;

const styles = StyleSheet.create({});
