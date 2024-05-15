import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Pressable, ScrollView } from 'react-native';
import { CallingState, SfuEvents, useCall, useCallStateHooks, VideoRenderer } from '@stream-io/video-react-native-sdk';

import inCallManager from 'react-native-incall-manager';

import { Play, SwitchCamera, VideoOff, Video, Radio, Mic, MicOff, CircleStop } from 'lucide-react-native';

import { sendRequest, requestMethods } from '../../../../core/tools/apiRequest';
import { colors, utilities } from '../../../../styles/utilities';

import { useNavigation } from '@react-navigation/native';
import CommentsOverlay from '../../CommentsOverlay/CommentsOverlay';

const StreamViewer = ({ showName, setCall, comments }) => {
    const call = useCall();
    const navigation = useNavigation();

    const { useCameraState, useMicrophoneState, useCallCallingState, useHasOngoingScreenShare, useParticipants } =
        useCallStateHooks();
    const { useParticipantCount, useLocalParticipant, useRemoteParticipants, useIsCallLive } = useCallStateHooks();

    const { status: microphoneStatus } = useMicrophoneState();
    const { status: cameraStatus } = useCameraState();

    const totalParticipants = useParticipantCount();
    const localParticipant = useLocalParticipant();
    const remoteParticipants = useRemoteParticipants();

    const callingState = useCallCallingState();
    const isCallLive = useIsCallLive();

    useEffect(() => {
        inCallManager.start({ media: 'video' });
        return () => {
            inCallManager.stop();
            if (call) {
                call.endCall();
                console.log('Ending Call!');
            }
        };
    }, []);

    const toggleVideoMuted = async () => {
        await call?.camera.toggle();
    };

    const toggleCameraFacingMode = async () => {
        await call?.camera.flip();
    };

    const toggleAudioMuted = async () => {
        await call?.microphone.toggle();
    };

    const handleStreamStatus = async () => {
        isCallLive ? handleExit() : handleStart();
    };

    const handleStart = async () => {
        await call?.goLive();
        await sendNotification(showName, null, 'Live Now!');
    };

    const togglePauseStart = async () => {
        console.log('Calling State:', callingState);
        if (callingState === CallingState.JOINED) {
            console.log('Calling state is Joined, Leaving');
            await call.leave();
        } else if (isCallLive) {
            const call = client.call('livestream', showId);
            await call.join();
        } else {
            console.log('Stream is in Backstage');
        }
    };

    const sendNotification = async (body, userIds = null, title = null) => {
        console.log('Sending Notification');
        try {
            const response = await sendRequest(requestMethods.POST, `notifications`, {
                userIds,
                title,
                body,
            });

            if (response.status !== 200) throw new Error('Failed to send notification');
        } catch (error) {
            console.log('Error sending notification:', error);
        }
    };

    const handleExit = async () => {
        inCallManager.stop();
        // if (viewer) {
        //     togglePauseStart();
        //     return;
        // }
        await call?.stopLive();
        await call?.stopPublish(SfuEvents.HealthCheckRequest, true);
        await call?.leave();
        call.off();
        setCall(null);
        setTimeout(() => {
            navigation.navigate('Streams');
        }, 1500);
    };

    return (
        <View style={[utilities.flexed, { backgroundColor: colors.bgDark }]}>
            <View style={[styles.topLiveStreamBar]}>
                <Text style={{ color: 'white' }}>{showName} </Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 4,
                        }}
                    >
                        <Text style={{ color: 'white' }}>{totalParticipants}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Radio size={24} color={isCallLive ? colors.primary : 'white'} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={[utilities.flexed, { alignItems: 'center', justifyContent: 'center' }]}>
                {localParticipant && <VideoRenderer participant={localParticipant} trackType="videoTrack" />}
                {!isCallLive && (
                    <Pressable onPress={handleStreamStatus}>
                        <Play size={48} color={colors.primary} style={{ marginLeft: 3 }} />
                    </Pressable>
                )}
            </View>
            <View style={styles.bottomLiveStreamBar}>
                <TouchableOpacity onPress={toggleVideoMuted}>
                    {cameraStatus === 'disabled' ? (
                        <VideoOff size={24} color={'white'} />
                    ) : (
                        <Video size={24} color={'white'} />
                    )}
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleCameraFacingMode}>
                    <SwitchCamera size={24} color={'white'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleAudioMuted}>
                    {microphoneStatus === 'disabled' ? (
                        <MicOff size={24} color={'white'} />
                    ) : (
                        <Mic size={24} color={'white'} />
                    )}
                </TouchableOpacity>
                {isCallLive && (
                    <>
                        <TouchableOpacity onPress={handleStreamStatus}>
                            {<CircleStop size={24} color={colors.primary} />}
                        </TouchableOpacity>
                        <CommentsOverlay comments={comments} />
                    </>
                )}
            </View>
        </View>
    );
};

export default StreamViewer;

const styles = StyleSheet.create({
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

    bottomLiveStreamBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: colors.bgDark,
        padding: 8,
    },

    topLiveStreamBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.bgDark,
        paddingVertical: 8,
        paddingHorizontal: 20,
        gap: 8,
    },

    goliveBtnContainer: {
        backgroundColor: '#12121250',
        borderRadius: 32,
        padding: 12,
    },
});
