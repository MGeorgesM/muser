import React, { useLayoutEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SystemNavigationBar from 'react-native-system-navigation-bar';

import { MessagesSquare, Store, Radio, AudioWaveform, UserRound } from 'lucide-react-native';

import FeedNavigator from '../navigators/FeedNavigator';
import ChatNavigator from '../navigators/ChatNavigator';
import VenueNavigator from '../navigators/VenueNavigator';
import ProfileNavigator from '../navigators/ProfileNavigator';
import LiveStreamNavigator from '../navigators/LiveStreamNavigator';

import { colors } from '../styles/utilities';
import LoadingScreen from '../components/LoadingScreen/LoadingScreen';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
    const [isLoading, setIsLoading] = useState(true);

    useLayoutEffect(() => {
        const setNavigationBarColor = async (color) => {
            try {
                await SystemNavigationBar.setNavigationColor(color);
                setIsLoading(false);
            } catch (error) {
                console.log('Error setting navigation bar color:', error);
            }
        };
        setNavigationBarColor(colors.bgDark);
    }, []);

    return isLoading ? (
        <LoadingScreen />
    ) : (
        <Tab.Navigator
            initialRouteName="Feed"
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
                headerShown: false,
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
            <Tab.Screen
                name="Venues"
                component={VenueNavigator}
                options={{ headerShown: false }}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        navigation.navigate('Venues', { screen: 'VenuesOverview' });
                    },
                })}
            />
            <Tab.Screen
                name="Chat"
                component={ChatNavigator}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        navigation.navigate('Chat', { screen: 'ChatMain' });
                    },
                })}
            />
            <Tab.Screen
                name="Feed"
                component={FeedNavigator}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        navigation.navigate('Feed', { screen: 'FeedMain' });
                    },
                })}
            />
            <Tab.Screen name="Live" component={LiveStreamNavigator} />
            <Tab.Screen name="Profile" component={ProfileNavigator} />
        </Tab.Navigator>
    );
};

export default MainTabs;

const styles = StyleSheet.create({});
