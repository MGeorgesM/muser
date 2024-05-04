import React from 'react';
import { TouchableOpacity } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';

import { colors } from '../styles/utilities';
import { ChevronLeft } from 'lucide-react-native';

import Chat from '../screens/Chat';
import ChatOverview from '../screens/ChatOverview';

const ChatStack = createStackNavigator();

const ChatNavigator = ({navigation}) => {
    return (
        <ChatStack.Navigator
            initialRouteName="ChatMain"
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.bgDark,
                    shadowColor: 'transparent',
                    borderBottomWidth: 0.25,
                    borderBottomColor: colors.lightGray,
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
            }}
        >
            <ChatStack.Screen name="ChatMain" component={ChatOverview}/>
            <ChatStack.Screen name="ChatDetails" component={Chat} />
        </ChatStack.Navigator>
    );
};

export default ChatNavigator;
