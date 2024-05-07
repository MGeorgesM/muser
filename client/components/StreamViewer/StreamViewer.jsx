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
import { colors, utilities } from '../../styles/utilities';

const StreamViewer = ({ viewer = false, showName, setCall }) => {
    const call = useCall();

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

    console.log('localParticipant:', localParticipant);
    console.log('remoteParticitPants', remoteParticipants);

    // const floatingParticipant = hasOngoingScreenShare && hasVideoTrack(currentSpeaker) && currentSpeaker;
    // const hasScreenShare = (p) => p?.publishedTracks.includes(SfuModels.TrackType.SCREEN_SHARE);
    // const hasOngoingScreenShare = useHasOngoingScreenShare();
    // const [currentSpeaker, ...otherParticipants] = useParticipants();
    // const presenter = hasOngoingScreenShare

    // console.log('Presenter', presenter);

    useEffect(() => {
        inCallManager.start({ media: 'video' });
        return () => {
            inCallManager.stop();
            if (call && !viewer) {
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

    const handleExit = async () => {
        inCallManager.stop();
        if (viewer) {
            togglePauseStart();
            return;
        }
        await call?.stopLive();
        await call?.stopPublish(SfuEvents.HealthCheckRequest, true);
        await call?.leave();
        call.off();
        setCall(null);
    };

    // const ViewerMode = () => {
    //     return (
    //         <View
    //             style={[
    //                 {
    //                     height: height * 0.5,
    //                     backgroundColor: 'black',
    //                     alignItems: 'center',
    //                     justifyContent: 'center',
    //                 },
    //             ]}
    //         >
    //             {/* {remoteParticipants.length > 0 && <VideoRenderer participant={local} trackType="videoTrack" />} */}
    //             {/* {presenter && <VideoRenderer participant={presenter} trackType="videoTrack" />} */}
    //             {/* {localParticipant && <VideoRenderer participant={localParticipant} trackType="videoTrack" />} */}

    //             <TouchableOpacity onPress={handleExit}>
    //                 {callingState === CallingState.JOINED ? (
    //                     <Pause size={42} color={'white'} />
    //                 ) : (
    //                     <Play size={42} color={'white'} />
    //                 )}
    //             </TouchableOpacity>
    //         </View>
    //     );
    // };

    return (
        <View style={[utilities.flexed, { backgroundColor: colors.bgDark }]}>
            {!viewer && (
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
                            {/* <Eye size={24} color={'white'} /> */}
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Radio size={24} color={isCallLive ? colors.primary : 'white'} />
                        </TouchableOpacity>
                    </View>
                </View>
            )}
            <View style={[utilities.flexed, { alignItems: 'center', justifyContent: 'center' }]}>
                {localParticipant && <VideoRenderer participant={localParticipant} trackType="videoTrack" />}
                {!isCallLive && (
                    <Pressable onPress={handleStreamStatus} style={styles.goliveBtnContainer}>
                        <Play size={48} color={colors.primary} style={{ marginLeft: 3 }} />
                    </Pressable>
                )}
            </View>
            {!viewer && (
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
                        <TouchableOpacity onPress={handleStreamStatus}>
                            {<CircleStop size={24} color={'white'} />}
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    );

    // return viewer ? (
    //     <ViewerLivestream
    //         ViewerLivestreamTopView={null}
    //         ViewerLeaveStreamButton={null}
    //         ViewerLivestreamControls={null}
    //     />
    // ) : (
    //     <HostMode />
    // );
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
        backgroundColor: colors.bgDark,
        borderRadius: 32,
        padding: 12,
    },
});
