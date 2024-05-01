import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';

import { HostLivestream, StreamCall, StreamVideo, StreamVideoClient, User } from '@stream-io/video-react-native-sdk';

import { useUser } from '../contexts/UserContext';

const StreamS = () => {
    const [call, setCall] = useState(null);
    const [startStream, setStartStream] = useState(false);

    const { currentUser, userToken } = useUser();

    const streamId = 6;
    const apiKey = 'cpt9ax3gakj3';
    const user = { id: currentUser.id };
    let client = null;
    console.log('currentUser:', currentUser);
    console.log('userToken:', userToken);

    useEffect(() => {
      client = new StreamVideoClient({ apiKey, user, token: userToken});

    }, [userToken]);


    useEffect(() => {
        const joinCall = async () => {
            try {
                const call = client.call('livestream', streamId);
                await call.join({ create: true });
                setCall(call);
            } catch (error) {
                console.error('Error joining call:', error);
            }
        };

        startStream && joinCall();
    }, []);

    // const handleStreamEnd = async () => {
    //     try {
    //         await call.end();
    //     } catch (error) {
    //         console.error('Error ending stream:', error);
    //     }
    // };


    if (call === null) return <Text>Loading...</Text>;

    return (
        <StreamVideo client={client}>
            <StreamCall call={call}>
                <SafeAreaView style={{ flex: 1 }}>
                    <HostLivestream onStartStreamHandler={() => setStartStream(true)}/>
                </SafeAreaView>
            </StreamCall>
        </StreamVideo>
    );
};

export default StreamS;

const styles = StyleSheet.create({});
