import React, { useLayoutEffect, useState } from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { StreamVideo, StreamVideoClient } from '@stream-io/video-react-native-sdk';

import { useUser } from '../core/data/contexts/UserContext';

import { profilePicturesUrl } from '../core/tools/apiRequest';

import Shows from '../screens/Shows/Shows';
import ShowStream from '../screens/Shows/ShowStream';
import ShowBroadcast from '../screens/Shows/ShowBroadcast';
import LoadingScreen from '../components/Misc/LoadingScreen/LoadingScreen';

const ShowsStack = createStackNavigator();

const streamApiKey = process.env.EXPO_PUBLIC_STREAM_ACCESS_KEY;

const ShowsNavigator = () => {
    const [client, setClient] = useState(null);
    const [initialRoute, setInitialRoute] = useState('Streams');

    const { currentUser, loggedIn } = useUser();

    useLayoutEffect(() => {
        const initializeClient = async () => {
            if (loggedIn && currentUser && Object.keys(currentUser).length !== 0) {
                setInitialRoute(initialRoute);

                const token = await AsyncStorage.getItem('streamToken');
                if (!token) return;

                const user = {
                    id: currentUser.id.toString(),
                    name: currentUser.name,
                    image: profilePicturesUrl + currentUser.picture,
                };

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
            <ShowsStack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
                <ShowsStack.Screen name="Streams" component={Shows} />
                <ShowsStack.Screen name="StreamBroadcast" component={ShowBroadcast} />
                <ShowsStack.Screen name="StreamView" component={ShowStream} />
            </ShowsStack.Navigator>
        </StreamVideo>
    ) : (
        <LoadingScreen />
    );
};

export default ShowsNavigator;
