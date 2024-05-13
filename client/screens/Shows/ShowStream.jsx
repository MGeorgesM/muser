import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView, Pressable } from 'react-native';

import UserComposer from '../../components/Misc/UserComposer/UserComposer';
import CommentCard from '../../components/Cards/CommentCard/CommentCard';
import BandMemberCard from '../../components/Cards/BandMemberCard/BandMemberCard';

import { useUser } from '../../contexts/UserContext';

import { StreamCall, ViewerLivestream } from '@stream-io/video-react-native-sdk';
import { useStreamVideoClient } from '@stream-io/video-react-native-sdk';
import inCallManager from 'react-native-incall-manager';

import { colors, utilities } from '../../styles/utilities';
import { Heart, Play, Pause, Maximize } from 'lucide-react-native';

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

const ShowStream = ({ navigation, route }) => {
    const { show } = route.params;

    const { currentUser } = useUser();
    const client = useStreamVideoClient();

    const [userComment, setUserComment] = useState('');
    const [comments, setComments] = useState([]);

    const [videoIsPlaying, setVideoIsPlaying] = useState(false);
    const [videoIsMaximized, setVideoIsMaximized] = useState(false);
    const [videoIsLiked, setVideoIsLiked] = useState(false);
    const [likes, setLikes] = useState([]);
    const [controlsVisible, setControlsVisible] = useState(false);

    const [call, setCall] = useState(null);

    // const showId = show.id.toString() + 'TEST78';
    const showId = 'TEST1122334X';
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
        const showId = show.id;
        const unsubscribeComments = setupCommentsListener(showId);
        const unsubscribeLikes = setupLikesListener(showId);

        return () => {
            unsubscribeComments();
            unsubscribeLikes();
        };
    }, [show.id]);

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
            setComments(fetchedComments);
        });

        return unsubscribeComments;
    };

    const setupLikesListener = async (showId) => {
        const likesRef = collection(fireStoreDb, 'shows', showId.toString(), 'likes');
        const q = query(likesRef, orderBy('createdAt', 'desc'));

        const unsubscribeLikes = onSnapshot(q, (snapshot) => {
            const fetchedLikes = snapshot.docs.map((doc) => ({
                _id: doc.id,
                userId: doc.data().userId,
                createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : new Date(),
            }));
            setLikes(fetchedLikes);
        });

        return unsubscribeLikes;
    };

    const handleLike = async () => {
        const showRef = doc(fireStoreDb, 'shows', show.id.toString());
        const likesRef = collection(showRef, 'likes');

        setVideoIsLiked(!videoIsLiked);

        if (!videoIsLiked) {
            try {
                const likeDoc = await getDoc(likesRef);
                const likeId = likeDoc.docs.find((doc) => doc.data().userId === currentUser.id).id;
                await deleteDoc(doc(likesRef, likeId));
            } catch (error) {
                console.log('Error deleting like:', error);
            }
        } else {
            try {
                await addDoc(likesRef, {
                    createdAt: serverTimestamp(),
                    userId: currentUser.id,
                });
            } catch (error) {
                console.log('Error adding like:', error);
            }
        }
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

    return (
        <View style={[utilities.flexed, { backgroundColor: colors.bgDark }]}>
            <View style={{ flex: 1, position: 'relative' }}>
                {call ? (
                    <StreamCall call={call}>
                        <View style={{ height: videoIsMaximized ? height * 1 : height * 0.5 }}>
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
                        <Pressable onPress={handleLike}>
                            <Heart size={24} color={colors.primary} fill={videoIsLiked ? colors.primary : null} />
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
                    <ScrollView showsVerticalScrollIndicator={false} style={styles.commentsContainer}>
                        {comments && comments.length > 0 ? (
                            comments.map((comment) => (
                                <CommentCard key={comment._id} avatar={comment.userAvatar} text={comment.text} />
                            ))
                        ) : (
                            <Text style={[utilities.myFontRegular, { color: colors.gray, paddingLeft: 20 }]}>
                                No comments yet
                            </Text>
                        )}
                    </ScrollView>
                    <UserComposer
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

export default ShowStream;

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
