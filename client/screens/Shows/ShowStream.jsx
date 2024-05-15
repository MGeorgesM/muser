import React, { useState, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    ScrollView,
    Pressable,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

import UserComposer from '../../components/Misc/UserComposer/UserComposer';
import CommentCard from '../../components/Cards/CommentCard/CommentCard';
import BandMemberCard from '../../components/Cards/BandMemberCard/BandMemberCard';

import { useUser } from '../../contexts/UserContext';

import { StreamCall, ViewerLivestream } from '@stream-io/video-react-native-sdk';
import { useStreamVideoClient } from '@stream-io/video-react-native-sdk';
import inCallManager from 'react-native-incall-manager';

import { colors, utilities } from '../../styles/utilities';
import { Heart, Play, Pause, Maximize, MessageSquare, MessageSquareOff } from 'lucide-react-native';

import { fireStoreDb } from '../../config/firebase';
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
import CommentsOverlay from '../../components/Misc/CommentsOverlay/CommentsOverlay';
import useKeyboardVisibility from '../../core/tools/keyboardVisibility';

const ShowStream = ({ navigation, route }) => {
    const { show } = route.params;

    const { currentUser } = useUser();
    const client = useStreamVideoClient();

    const [userComment, setUserComment] = useState('');
    const [comments, setComments] = useState([]);

    const [videoIsPlaying, setVideoIsPlaying] = useState(false);
    const [videoIsMaximized, setVideoIsMaximized] = useState(false);
    const [videoIsLiked, setVideoIsLiked] = useState(false);
    const [reactionsVisible, setReactionsVisible] = useState(false);
    const [controlsVisible, setControlsVisible] = useState(false);

    const [call, setCall] = useState(null);

    const keyboardVisible = useKeyboardVisibility();

    const showId = show.id.toString() + 'DEMO' ?? {};
    console.log('Show ID Viewer:', showId);
    // const showId = 'TEST1122334XXX';
    // client && console.log('Client Found!');
    // console.log('Show ID:', show.id);
    // console.log('Call:', call);
    // console.log('Show:', show);
    useEffect(() => {
        if (!client || call) return;

        const setupCall = async () => {
            return;
            // console.log('Setting up call');
            // try {
            //     const call = client.call('livestream', showId);
            //     await call.get();
            //     call && console.log('Call set up!');

            //     setCall(call);
            //     console.log(call);
            // } catch (error) {
            //     setVideoIsPlaying(false);
            //     console.log('Error setting up Call', error);
            // }
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
        let unsubscribeComments;

        const fetchComments = async () => {
            unsubscribeComments = await setupCommentsListener(show.id);
        };

        fetchComments();

        return () => {
            if (unsubscribeComments) {
                unsubscribeComments();
            }
        };
    }, [show.id]);

    useEffect(() => {
        console.log('keyboardVisible:', keyboardVisible);
    }, [keyboardVisible]);

    const setupCommentsListener = async (showId) => {
        const commentsRef = collection(fireStoreDb, 'shows', showId.toString(), 'comments');
        const q = query(commentsRef, orderBy('createdAt', 'desc'));

        const unsubscribeComments = onSnapshot(q, (snapshot) => {
            const fetchedComments = snapshot.docs.map((doc) => ({
                _id: doc.id,
                text: doc.data().text,
                createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : new Date(),
                userAvatar: doc.data().userAvatar,
                userId: doc.data().userId,
            }));
            console.log('Fetched Comments:', fetchedComments);
            setComments(fetchedComments);
        });

        return unsubscribeComments;
    };

    const handleLike = async () => {
        if (videoIsLiked) return;
        setVideoIsLiked(!videoIsLiked);
        await onSend('❤');
    };

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
                showRef = await createShowAndComments(comment);
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
        setVideoIsMaximized(!videoIsMaximized);
    };

    const handleUserTouches = () => {
        setControlsVisible(!controlsVisible);
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={[utilities.flexed, { backgroundColor: colors.bgDark }]}>
                <View style={{ flex: 1, position: 'relative' }}>
                    {call ? (
                        <StreamCall call={call}>
                            <View
                                style={{ height: videoIsMaximized ? height * 1 : height * 0.5, position: 'relative' }}
                            >
                                <ViewerLivestream
                                    ViewerLeaveStreamButton={null}
                                    ViewerLivestreamTopView={null}
                                    ViewerLivestreamControls={null}
                                />
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
                            <>
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
                                {videoIsMaximized && (
                                    <Pressable
                                        onPress={() => setReactionsVisible(!reactionsVisible)}
                                        style={{
                                            position: 'absolute',
                                            bottom: 42,
                                            right: 12,
                                            marginTop: 12,
                                        }}
                                    >
                                        {reactionsVisible ? (
                                            <MessageSquare size={24} color={'white'} />
                                        ) : (
                                            <MessageSquareOff size={24} color={'white'} />
                                        )}
                                    </Pressable>
                                )}
                            </>
                        )}
                    </Pressable>
                </View>
                {!videoIsMaximized && show && (
                    <View style={[!keyboardVisible && utilities.flexed, { backgroundColor: colors.bgDark }]}>
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
                                <Text style={[utilities.textLeft, utilities.textL, utilities.myFontBold]}>
                                    {`${show.band?.name}`}
                                </Text>
                                <Text style={[utilities.textM, utilities.myFontRegular, { color: colors.gray }]}>
                                    {`Live at ${show.venue?.venue_name} - ${show.venue.location?.name}`}
                                </Text>
                            </View>
                            <Pressable onPress={handleLike}>
                                <Heart size={24} color={colors.primary} fill={videoIsLiked ? colors.primary : colors.bgDark} />
                            </Pressable>
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

                        {!keyboardVisible && (
                            <ScrollView showsVerticalScrollIndicator={false} style={styles.commentsContainer}>
                                {comments && comments.length > 0 ? (
                                    comments.map((comment) => (
                                        <CommentCard
                                            key={comment._id}
                                            avatar={comment.userAvatar}
                                            text={comment.text}
                                        />
                                    ))
                                ) : (
                                    <Text style={[utilities.myFontRegular, { color: colors.gray, paddingLeft: 20 }]}>
                                        No comments yet
                                    </Text>
                                )}
                            </ScrollView>
                        )}
                    </View>
                )}
                {(!videoIsMaximized || reactionsVisible) && (
                    <KeyboardAvoidingView>
                        {videoIsMaximized && reactionsVisible && <CommentsOverlay comments={comments} bottom={48} />}
                        <UserComposer
                            placeholder="Write a comment"
                            value={userComment}
                            onChangeText={setUserComment}
                            onSendPress={handlePostComment}
                            overlay={videoIsMaximized}
                        />
                    </KeyboardAvoidingView>
                )}
            </View>
        </KeyboardAvoidingView>
    );
};

export default ShowStream;

const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    commentsContainer: {
        flex: 1,
        paddingTop: 16,
        borderTopWidth: 0.5,
        borderTopColor: colors.lightGray,
    },

    maximizedComposer: {
        borderTopWidth: 1,
        borderTopColor: colors.white,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent black background
        padding: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
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
