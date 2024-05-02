import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Button, Dimensions } from 'react-native';
import {
    CallingState,
    SfuEvents,
    useCall,
    useCallStateHooks,
    useIncallManager,
    useStreamVideoClient,
    VideoRenderer,
} from '@stream-io/video-react-native-sdk';

import InCallManager from 'react-native-incall-manager';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    Play,
    SwitchCamera,
    VideoOff,
    Video,
    Radio,
    Mic,
    MicOff,
    CirclePlay,
    Users,
    Eye,
    CircleStop,
    Pause,
} from 'lucide-react-native';

import {
    HostLivestream,
    CallContent,
    StreamCall,
    StreamVideo,
    StreamVideoClient,
    ViewerLivestream,
} from '@stream-io/video-react-native-sdk';

import { useUser } from '../contexts/UserContext';
import { profilePicturesUrl } from '../core/tools/apiRequest';
import inCallManager from 'react-native-incall-manager';

const StreamBroadcast = () => {
    const streamId = 'hgjbkdafdf';
    const [call, setCall] = useState(null);
    const [viewer, setViewer] = useState(false);

    const client = useStreamVideoClient();

    client && console.log('Client Found!');

    const createCall = async () => {
        console.log('Creating call');

        if (!client) {
            console.log('No client found');
            return;
        }
        console.log('Client Found!');
        try {
            const call = client.call('livestream', streamId);
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
        console.log('Client Found!');

        try {
            const call = client.call('livestream', streamId);
            await call.join();
            setCall(call);
        } catch (error) {
            console.error('Error joining call:', error);
        }

        setViewer(true);
    };

    // const leaveCall = async () => {
    //     console.log('leaving call');

    //     if (call) {
    //         await call.leave().catch(console.error);
    //         inCallManager.stop();
    //         // setCall(null);
    //     }
    // };

    // const stopLiveStream = async () => {
    //     if (call) {
    //         // await call.stopLive().catch(console.error);
    //         await call.endCall().catch(console.error);
    //         inCallManager.stop();
    //         setCall(null);
    //     }
    // };

    const LiveStreamViewerLayout = ({ viewer = true }) => {
        const call = useCall();

        const { useCameraState, useMicrophoneState, useCallCallingState } = useCallStateHooks();
        const { useParticipantCount, useLocalParticipant, useRemoteParticipants, useIsCallLive } = useCallStateHooks();

        const { status: microphoneStatus } = useMicrophoneState();
        const { status: cameraStatus } = useCameraState();

        const totalParticipants = useParticipantCount();
        const localParticipant = useLocalParticipant();
        const remoteParticipants = useRemoteParticipants();

        const callingState = useCallCallingState();
        const isCallLive = useIsCallLive();

        console.log('localParticipant:', localParticipant);

        useEffect(() => {
            InCallManager.start({ media: 'video' });
            return () => {
                InCallManager.stop();
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
        };

        const togglePauseStart = async () => {
            if(callingState === CallingState.JOINED) {
                console.log('Calling state is Joined, Leaving')
                await call.leave();
            } else {
                await call.join();
            }

        }

        const handleExit = async () => {
            inCallManager.stop();
            if (viewer) {
                togglePauseStart();
            }
            await call?.stopLive();
            await call?.stopPublish(SfuEvents.HealthCheckRequest, true);
            await call?.leave();
            call.off();
            setCall(null);
        };

        const ViewerMode = () => {
            return (
                <View
                    style={[
                        {
                            height: height * 0.5,
                            backgroundColor: 'black',
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                    ]}
                >
                    {localParticipant && <VideoRenderer participant={remoteParticipants} trackType="videoTrack" />}

                    <TouchableOpacity onPress={handleExit}>
                        <Play size={42} color={'white'} />
                    </TouchableOpacity>
                </View>
            );
        };

        const HostMode = () => {
            return (
                <View style={styles.flexed}>
                    <View style={styles.topLiveStreamBar}>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <Text style={{ color: 'white' }}>{totalParticipants}</Text>
                            {/* <Eye size={24} color={'white'} /> */}
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Radio size={24} color={isCallLive ? '#FFB84F' : 'white'} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.flexed}>
                        {localParticipant && <VideoRenderer participant={localParticipant} trackType="videoTrack" />}
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
                        <TouchableOpacity onPress={handleStreamStatus}>
                            {isCallLive ? <CircleStop size={24} color={'white'} /> : <Play size={24} color={'white'} />}
                        </TouchableOpacity>
                    </View>
                </View>
            );
        };

        return viewer ? <ViewerMode /> : <HostMode />;
    };

    if (call === null)
        return (
            <View style={styles.liveStreamBroadcasttartContainer}>
                <TouchableOpacity onPress={createCall} style={styles.callStartBtn}>
                    <Text style={{ color: 'white' }}>Start Stream</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={joinCall} style={styles.callJoinBtn}>
                    <Text style={{ color: 'white' }}>Watch Stream</Text>
                </TouchableOpacity>
            </View>
        );

    return (
        <StreamCall call={call}>
            <SafeAreaView style={{ flex: 1, marginTop: 64 }}>
                <LiveStreamViewerLayout viewer={viewer} />
            </SafeAreaView>
        </StreamCall>
    );
};

export default StreamBroadcast;

const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    liveStreamBroadcasttartContainer: {
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

    bottomLiveStreamBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 8,
    },

    topLiveStreamBar: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingVertical: 8,
        paddingHorizontal: 20,
        gap: 8,
    },
});
