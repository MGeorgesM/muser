import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MessagesSquare, Store, Radio, AudioWaveform, UserRound } from 'lucide-react-native';

import FeedNavigator from '../navigators/FeedNavigator';
import ChatNavigator from '../navigators/ChatNavigator';
import ShowsNavigator from '../navigators/ShowsNavigator';
import VenuesNavigator from '../navigators/VenuesNavigator';
import ProfileNavigator from '../navigators/ProfileNavigator';

import { colors } from '../styles/utilities';
import { useNavigationBarColor } from '../core/tools/systemNavigationBar';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
    useNavigationBarColor(colors.bgDark);
    return (
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
                component={VenuesNavigator}
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
            <Tab.Screen name="Live" component={ShowsNavigator} />
            <Tab.Screen name="Profile" component={ProfileNavigator} />
        </Tab.Navigator>
    );
};

export default MainTabs;