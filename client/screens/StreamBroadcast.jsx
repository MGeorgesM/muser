import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Button, Dimensions, Pressable } from 'react-native';
import {
    CallingState,
    SfuEvents,
    useCall,
    useCallStateHooks,
    useStreamVideoClient,
    VideoRenderer,
} from '@stream-io/video-react-native-sdk';

import inCallManager from 'react-native-incall-manager';

import { Play, SwitchCamera, VideoOff, Video, Radio, Mic, MicOff, CircleStop, Pause } from 'lucide-react-native';

import { StreamCall, ViewerLivestream } from '@stream-io/video-react-native-sdk';
import { colors, utilities } from '../styles/utilities';
import StreamViewer from '../components/StreamViewer/StreamViewer';

const StreamBroadcast = ({ navigation, route }) => {
    const { showId, showName } = route.params;

    // const showIdString = showId.toString() + 'TEST78' ?? {};
    const showIdString = 'ajskdfjjsdkfjaksfdfffffi'

    const [call, setCall] = useState(null);
    const [viewer, setViewer] = useState(false);

    const client = useStreamVideoClient();

    client && console.log('Client Found!');
    console.log('Show ID:', showIdString);

    const createCall = async () => {
        console.log('Creating call');

        if (!client) {
            console.log('No client found');
            return;
        }
        console.log('Client Found!');
        try {
            const call = client.call('livestream', showIdString);
            await call.join({ create: true });
            setCall(call);
        } catch (error) {
            console.error('Error joining call:', error);
        }

        setViewer(false);
    };

    const joinCall = async () => {
        console.log('Joining call');

        if (!client) {
            console.log('No client found');
            return;
        }
        setViewer(true);
        console.log('Client Found!');

        try {
            const call = client.call('livestream', showIdString);
            await call.join({ create: true });
            setCall(call);
        } catch (error) {
            console.error('Error joining call:', error);
        }
    };

    if (call === null)
        return (
            <View style={styles.liveStreamBroadcastContainer}>
                <TouchableOpacity onPress={createCall}>
                    <Radio size={48} color={colors.darkGray} />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, color: colors.darkGray }}>Go Live</Text>
            </View>
        );

    return (
        <View style={[utilities.flexed, { backgroundColor: colors.bgDark }]}>
            <StreamCall call={call}>
                <SafeAreaView style={{ flex: 1, marginTop: 64 }}>
                    <StreamViewer viewer={viewer} showName={showName} setCall={setCall}/>
                </SafeAreaView>
            </StreamCall>
        </View>
    );
};

export default StreamBroadcast;

const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    liveStreamBroadcastContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        backgroundColor: colors.bgDark,
    },
});
