import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Button } from 'react-native';
import { useCall, useCallStateHooks, useIncallManager, VideoRenderer } from '@stream-io/video-react-native-sdk';

import InCallManager from 'react-native-incall-manager';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    HostLivestream,
    StreamCall,
    StreamVideo,
    StreamVideoClient,
    ViewerLivestream,
} from '@stream-io/video-react-native-sdk';

import { useUser } from '../contexts/UserContext';
import { profilePicturesUrl } from '../core/tools/apiRequest';
import inCallManager from 'react-native-incall-manager';

const StreamS = () => {
    const [streamToken, setStreamToken] = useState(null);
    const [startStream, setStartStream] = useState(false);
    const [client, setClient] = useState(null);
    const [call, setCall] = useState(null);
    const [user, setUser] = useState({});
    const [watchMode, setWatchMode] = useState(false);
    // const [streamDisplay, setStreamDisplay] = useState(false);

    const { currentUser, loggedIn } = useUser();

    const streamId = 8883888;
    const apiKey = 'cpt9ax3gakj3';

    // const LivestreamUI = () => {
    //     const call = useCall();

    //     const { useParticipantCount, useLocalParticipant, useIsCallLive } = useCallStateHooks();

    //     const totalParticipants = useParticipantCount();
    //     const localParticipant = useLocalParticipant();
    //     const isCallLive = useIsCallLive();

    //     useEffect(() => {
    //         InCallManager.start({ media: 'video', auto: 'true' });
    //         return () => InCallManager.stop();
    //     }, []);

    //     return (
    //         <View style={styles.flexed}>
    //             <Text style={styles.text}>Live: {totalParticipants}</Text>
    //             <View style={styles.flexed}>
    //                 {localParticipant && <VideoRenderer participant={localParticipant} trackType="videoTrack" />}
    //             </View>
    //             <View style={styles.bottomBar}>
    //                 {isCallLive ? (
    //                     <Button onPress={stopLiveStream} title="Stop Livestream" />
    //                 ) : (
    //                     <Button
    //                         onPress={() => {
    //                             call?.goLive();
    //                         }}
    //                         title="Start Livestream"
    //                     />
    //                 )}
    //             </View>
    //         </View>
    //     );
    // };

    const liveStreamWatch = () => {
        const call = useCall();

        const { useParticipantCount, useLocalParticipant, useIsCallLive } = useCallStateHooks();

        const totalParticipants = useParticipantCount();
        const localParticipant = useLocalParticipant();
        const isCallLive = useIsCallLive();

        useEffect(() => {
            InCallManager.start({ media: 'video', auto: 'true' });
            return () => InCallManager.stop();
        }, []);

        return (
            <View style={styles.flexed}>
                <Text style={styles.text}>Live: {totalParticipants}</Text>
                <View style={styles.flexed}>
                    {localParticipant && <VideoRenderer participant={localParticipant} trackType="videoTrack" />}
                </View>
                <View style={styles.bottomBar}>
                    {isCallLive ? (
                        <Button onPress={stopLiveStream} title="Stop Livestream" />
                    ) : (
                        <Button
                            onPress={() => {
                                call?.goLive();
                            }}
                            title="Start Livestream"
                        />
                    )}
                </View>
            </View>
        );
    };

    useEffect(() => {
        console.log('User:', currentUser);
        console.log('Logged in:', loggedIn);

        if (!loggedIn && Object.keys(currentUser).length === 0) return;

        const user = {
            id: currentUser?.id.toString(),
            name: currentUser?.name,
            image: profilePicturesUrl + currentUser?.picture,
        };

        const getStreamToken = async () => {
            const token = await AsyncStorage.getItem('streamToken');
            setStreamToken(token);
        };

        getStreamToken();

        if (!streamToken || Object.keys(user).length === 0) return;

        console.log('Stream token:', streamToken);
        console.log('User!:', user.id);

        const streamClient = new StreamVideoClient({
            apiKey,
            user,
            token: streamToken,
            options: {
                logLevel: 'debug',
            },
        });

        streamClient && console.log('Connected to stream client!');

        setClient(streamClient);
    }, []);

    const createCall = async () => {
        if (!client) {
            console.log('No client found');
            return;
        }
        console.log('client:', client);
        try {
            const call = client.call('livestream', streamId);
            await call.getOrCreate();
            setCall(call);
        } catch (error) {
            console.error('Error joining call:', error);
        }
    };

    const joinCall = async () => {

        if (!client) {
            console.log('No client found');
            return;
        }

        setWatchMode(true);
        console.log('client:', client);
        try {
            const call = client.call('livestream', streamId);
            await call.join();
            setCall(call);
        } catch (error) {
            console.error('Error joining call:', error);
        }
    };

    const leaveCall = async () => {
        if (call) {
            await call.leave().catch(console.error);
            inCallManager.stop();
            setCall(null);
        }
    };

    const stopLiveStream = async () => {
        if (call) {
            // await call.stopLive().catch(console.error);
            await call.endCall().catch(console.error);
            inCallManager.stop();
            setCall(null);
        }
    };

    if (call === null)
        return (
            <View style={styles.liveStreamStartContainer}>
                <TouchableOpacity onPress={createCall} style={styles.callStartBtn}>
                    <Text style={{ color: 'white' }}>Start Stream</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={joinCall} style={styles.callJoinBtn}>
                    <Text style={{ color: 'white' }}>Watch Stream</Text>
                </TouchableOpacity>
            </View>
        );

    return (
        <StreamVideo client={client}>
            <StreamCall call={call}>
                <SafeAreaView style={{ flex: 1, marginTop: 64 }}>
                    {!watchMode ? (
                        // <LivestreamUI />
                        <HostLivestream onEndStreamHandler={stopLiveStream} />
                    ) : (
                        <ViewerLivestream onLeaveStreamHandler={leaveCall} />
                    )}
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
        gap: 8,
    },
    callStartBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'blue',
        padding: 10,
    },
    callJoinBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'green',
        padding: 10,
    },
    flexed: {
        flex: 1,
    },
    text: {
        alignSelf: 'center',
        color: 'white',
        backgroundColor: 'blue',
        padding: 6,
        margin: 4,
    },
    bottomBar: {
        alignSelf: 'center',
        margin: 4,
    },
});
