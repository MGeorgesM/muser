import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    HostLivestream,
    StreamCall,
    StreamVideo,
    StreamVideoClient,
    User,
    name,
} from '@stream-io/video-react-native-sdk';

import { useUser } from '../contexts/UserContext';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const StreamS = () => {
    const [call, setCall] = useState(null);
    const [streamToken, setStreamToken] = useState(null);
    const [startStream, setStartStream] = useState(false);
    const [user, setUser] = useState({});
    const [client, setClient] = useState(null);

    const { currentUser } = useUser();

    const streamId = 10;
    const apiKey = 'cpt9ax3gakj3';

    // const token = ''

    useEffect(() => {
        if (Object.keys(currentUser).length === 0) return;

        const user = { id: currentUser.id.toString(), name: currentUser.name, image: currentUser.picture };

        const getStreamToken = async () => {
            const token = await AsyncStorage.getItem('streamToken');
            setStreamToken(token);
        };

        getStreamToken();

        if (!streamToken || Object.keys(user).length === 0) return;

        console.log('Stream token:', streamToken);
        console.log('User!:', user.id);

        streamClient = new StreamVideoClient({
            apiKey,
            user,
            token: streamToken,
            options: {
                logLevel: 'warn',
            },
        });

        console.log('Clientsetup:', streamClient)

        setClient(streamClient);
    },[streamId]);

    const joinCall = async () => {
        console.log('client:', client)
        try {
            const call = client.call('livestream', streamId);
            await call.join({ create: true });
            setCall(call);
        } catch (error) {
            console.error('Error joining call:', error);
        }
    };

    // const handleStreamEnd = async () => {
    //     try {
    //         await call.end();
    //     } catch (error) {
    //         console.error('Error ending stream:', error);
    //     }
    // };

    if (call === null)
        return (
            <View style={styles.liveStreamStartContainer}>
                <TouchableOpacity onPress={joinCall} style={styles.callStartBtn}>
                    <Text style={{color:'white'}}>Start Stream</Text>
                </TouchableOpacity>
            </View>
        );

    return (
        <StreamVideo client={client}>
            <StreamCall call={call}>
                <SafeAreaView style={{ flex: 1 }}>
                    <HostLivestream onStartStreamHandler={() => setStartStream(true)} />
                </SafeAreaView>
            </StreamCall>
        </StreamVideo>
    );
};

export default StreamS;

const styles = StyleSheet.create({

    liveStreamStartContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    callStartBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'blue',
        padding: 10,
    },
});
