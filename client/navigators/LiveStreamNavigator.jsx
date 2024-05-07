import React, { useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import { useUser } from '../contexts/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { profilePicturesUrl } from '../core/tools/apiRequest';

import Streams from '../screens/Streams';
import StreamBroadcast from '../screens/StreamBroadcast';
import StreamView from '../screens/StreamView';
import { StreamVideo, StreamVideoClient } from '@stream-io/video-react-native-sdk';

const LiveStreamStack = createStackNavigator();

const streamApiKey = process.env.EXPO_PUBLIC_STREAM_ACCESS_KEY;

const LiveStreamNavigator = () => {
    const [client, setClient] = useState(null);
    const [initialRoute, setInitialRoute] = useState('Streams');

    const { currentUser, loggedIn } = useUser();

    useEffect(() => {
        const initializeClient = async () => {
            if (loggedIn && currentUser && Object.keys(currentUser).length !== 0) {
                // const initialRoute = currentUser.role.id === 1 ? 'Streams' : 'StreamBroadcast'
                setInitialRoute(initialRoute);

                const token = await AsyncStorage.getItem('streamToken');

                if (!token) return;

                const user = {
                    id: currentUser.id.toString(),
                    name: currentUser.name,
                    image: profilePicturesUrl + currentUser.picture,
                };

                console.log('Initialized Client', user);
                console.log('CurrentUser', currentUser);

                try {
                    const client = new StreamVideoClient({
                        apiKey: streamApiKey,
                        user,
                        token,
                        options: {
                            logLevel: 'error',
                        },
                    });
                    setClient(client);
                    console.log('Connected to GET stream client!');
                } catch (error) {
                    console.error('Error setting up Stream client:', error);
                }
            }
        };

        initializeClient();

        return () => {
            if (client) {
                client.disconnectUser();
                console.log('Client disconnected on component unmount.');
            }
        };
    }, [loggedIn, currentUser]);

    return client ? (
        <StreamVideo client={client}>
            <LiveStreamStack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
                <LiveStreamStack.Screen name="Streams" component={Streams} />
                <LiveStreamStack.Screen name="StreamBroadcast" component={StreamBroadcast} />
                <LiveStreamStack.Screen name="StreamView" component={StreamView} />
            </LiveStreamStack.Navigator>
        </StreamVideo>
    ) : (
        <ActivityIndicator size="large" color="#000ff" />
    );
};

export default LiveStreamNavigator;
