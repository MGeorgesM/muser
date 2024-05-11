import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView, Pressable } from 'react-native';

import CommentCard from '../components/Cards/CommentCard/CommentCard';
import BandMemberCard from '../components/Cards/BandMemberCard/BandMemberCard';

import { useUser } from '../contexts/UserContext';

import { fireStoreDb } from '../config/firebase';
import {
    collection,
    query,
    onSnapshot,
    serverTimestamp,
    orderBy,
    doc,
    getDoc,
    addDoc,
    setDoc,
} from 'firebase/firestore';

import {
    StreamCall,
    VideoRenderer,
    ViewerLivestream,
    useCall,
    useCallStateHooks,
} from '@stream-io/video-react-native-sdk';
import { useStreamVideoClient } from '@stream-io/video-react-native-sdk';
import inCallManager from 'react-native-incall-manager';

import { colors, utilities } from '../styles/utilities';
import { Heart, Play, Pause, Maximize } from 'lucide-react-native';

import ChatTextInput from '../components/ChatTextInput/ChatTextInput';

const StreamView = ({ navigation, route }) => {
    const { show } = route.params;

    const { currentUser } = useUser();
    const client = useStreamVideoClient();

    const [userComment, setUserComment] = useState('');
    const [comments, setComments] = useState([]);

    const [videoIsPlaying, setVideoIsPlaying] = useState(false);
    const [videoIsMaximized, setVideoIsMaximized] = useState(false);
    const [videoIsLiked, setVideoIsLiked] = useState(false);
    const [controlsVisible, setControlsVisible] = useState(false);

    const [call, setCall] = useState(null);

    // const showId = show.id.toString() + 'TEST78';
    const showId = 'TEST112233X';
    // client && console.log('Client Found!');
    // console.log('Show ID:', show.id);
    // console.log('Call:', call);

    useEffect(() => {
        if (!client || call) return;

        const setupCall = async () => {
            return;
            console.log('Setting up call');
            try {
                const call = client.call('livestream', showId);
                await call.get();
                call && console.log('Call set up!');

                setCall(call);
                console.log(call);
            } catch (error) {
                setVideoIsPlaying(false);
                console.log('Error setting up Call', error);
            }
        };

        setupCall();

        return () => {
            if (call) {
                call.leave();
                setCall(null);
                inCallManager.stop();
            }
        };
    }, [client, show.id]);

    useEffect(() => {
        let unsubscribe;

        const setupCommentsListener = async () => {
            const commentsRef = collection(fireStoreDb, 'shows', show.id.toString(), 'comments');

            if (!commentsRef) return;

            const q = query(commentsRef, orderBy('createdAt', 'desc'));

            unsubscribe = onSnapshot(q, (snapshot) => {
                const fetchedComments = snapshot.docs.map((doc) => ({
                    _id: doc.id,
                    text: doc.data().text,
                    createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : new Date(),
                    userAvatar: doc.data().userAvatar,
                    userId: doc.data().userId,
                }));
                setComments(fetchedComments);
            });
        };
        setupCommentsListener();
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [show.id]);

    const createShowAndComments = async (initialComment) => {
        const newShowRef = doc(collection(fireStoreDb, 'shows'));
        const commentsRef = collection(newShowRef, 'comments');

        await addDoc(commentsRef, {
            text: initialComment,
            createdAt: serverTimestamp(),
            userAvatar: currentUser.picture,
            userId: currentUser.id,
        });

        await setDoc(newShowRef, {
            showId: show.id,
            createdAt: serverTimestamp(),
        });

        return newShowRef;
    };

    const onSend = useCallback(
        async (comment) => {
            let showRef = doc(fireStoreDb, 'shows', show.id.toString());
            const showSnapshot = await getDoc(showRef);

            if (!showRef) {
                const initialComment = comment.trim();
                showRef = await createShowAndComments(initialComment);
            } else {
                const commentsRef = collection(showRef, 'comments');

                await addDoc(commentsRef, {
                    text: comment,
                    createdAt: serverTimestamp(),
                    userAvatar: currentUser.picture,
                    userId: currentUser.id,
                });
            }
        },
        [fireStoreDb, show.id, currentUser.id]
    );

    const handlePostComment = () => {
        console.log('Posting comment');
        if (userComment.trim()) {
            onSend(userComment);
            setUserComment('');
        }
    };

    const joinCall = async () => {
        console.log('Joining call');

        if (!client) {
            console.log('No client found');
            return;
        }
        // setViewer(true);
        console.log('Client Found!');

        try {
            const call = client.call('livestream', showId);
            await call.join({ create: false });
            setCall(call);
            console.log('Call joined!', call);
            call && setVideoIsPlaying(true);
            setControlsVisible(false);
        } catch (error) {
            console.log('Error joining call:', error);
        }
    };

    const handleUserStreamInteraction = () => {
        if (!call) {
            joinCall();
            return;
        } else if (videoIsPlaying) {
            call.leave();
            setVideoIsPlaying(false);
        } else {
            joinCall();
            setVideoIsPlaying(true);
        }
    };

    const handleVideoSizeToggle = () => {
        console.log('toggling video size');
        setVideoIsMaximized(!videoIsMaximized);
    };

    const handleUserTouches = () => {
        setControlsVisible(!controlsVisible);
    };

    // const StreamViewerWatch = (setCall) => {
    //     const call = useCall();
    //     const { useParticipantCount, useLocalParticipant, useRemoteParticipants, useIsCallLive } = useCallStateHooks();

    //     const totalParticipants = useParticipantCount();
    //     const localParticipant = useLocalParticipant();
    //     const remoteParticipants = useRemoteParticipants();

    //     console.log('local participant view ', localParticipant);

    //     useEffect(() => {
    //         inCallManager.start({ media: 'video', auto: true });
    //         return () => {
    //             inCallManager.stop();
    //             if (call) {
    //                 call.leave();
    //                 console.log('Leaving Call!');
    //             }
    //         };
    //     }, []);

    //     return localParticipant && <VideoRenderer participant={localParticipant} objectFit={'cover'} trackType="videoTrack" />;
    // };

    return (
        <View style={[utilities.flexed]}>
            <View style={{ flex: 1, position: 'relative' }}>
                {call ? (
                    <StreamCall call={call}>
                        <View style={{ height: videoIsMaximized ? height * 1 : height * 0.5 }}>
                            <ViewerLivestream
                                ViewerLeaveStreamButton={null}
                                ViewerLivestreamTopView={null}
                                ViewerLivestreamControls={null}
                            />
                            {/* <StreamViewerWatch /> */}
                        </View>
                    </StreamCall>
                ) : (
                    !videoIsMaximized && (
                        <View
                            style={[
                                {
                                    height: height * 0.5,
                                    backgroundColor: colors.bgDarkest,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                },
                            ]}
                        />
                    )
                )}
                <Pressable style={StyleSheet.absoluteFill} onPress={handleUserTouches}>
                    <Pressable
                        onPress={handleUserStreamInteraction}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            marginTop: 24,
                            transform: [{ translateX: -21 }, { translateY: -21 }],
                        }}
                    >
                        {!videoIsPlaying ? (
                            <Play size={42} color={'white'} />
                        ) : (
                            controlsVisible && <Pause size={42} color={'white'} />
                        )}
                    </Pressable>
                    {videoIsPlaying && controlsVisible && (
                        <Pressable
                            onPress={handleVideoSizeToggle}
                            style={{
                                position: 'absolute',
                                bottom: 12,
                                right: 12,
                                marginTop: 12,
                            }}
                        >
                            <Maximize size={24} color={'white'} />
                        </Pressable>
                    )}
                </Pressable>
            </View>
            {!videoIsMaximized && (
                <View style={[utilities.flexed, { backgroundColor: colors.bgDark }]}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingTop: 20,
                            paddingHorizontal: 20,
                            paddingBottom: 8,
                        }}
                    >
                        <View>
                            <Text style={[utilities.textCenter, utilities.textL, utilities.myFontBold]}>
                                {`${show.band.name} - Live`}
                            </Text>
                            <Text style={[utilities.textM, utilities.myFontRegular, { color: colors.gray }]}>
                                {show.venue.name}
                            </Text>
                        </View>

                        <Heart size={24} color={colors.primary} />
                    </View>
                    <View style={[{ paddingLeft: 20 }]}>
                        <Text style={[utilities.textM, utilities.myFontBold, { marginBottom: 8 }]}>Band</Text>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            {show.band.members.map((member) => (
                                <BandMemberCard
                                    key={member.id}
                                    entity={member}
                                    handlePress={() => {
                                        navigation.navigate('Feed', {
                                            screen: 'ProfileDetails',
                                            params: { userId: member.id },
                                        });
                                    }}
                                />
                            ))}
                        </ScrollView>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false} style={styles.commentsContainer}>
                        {comments && comments.length > 0 ? (
                            comments.map((comment) => (
                                <CommentCard key={comment._id} avatar={comment.userAvatar} text={comment.text} />
                            ))
                        ) : (
                            <Text style={[utilities.textCenter, utilities.myFontRegular, { color: colors.gray }]}>
                                No comments yet. Share your thoughts.
                            </Text>
                        )}
                    </ScrollView>
                    <ChatTextInput
                        placeholder="Write a comment"
                        value={userComment}
                        onChangeText={setUserComment}
                        onSendPress={handlePostComment}
                    />
                </View>
            )}
        </View>
    );
};

export default StreamView;

const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    commentsContainer: {
        flex: 1,
        paddingTop: 16,
        borderTopWidth: 0.5,
        borderTopColor: colors.lightGray,
    },

    userInputField: {
        height: 48,
        paddingRight: 20,
        borderTopWidth: 1,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopColor: colors.lightGray,
    },
});
