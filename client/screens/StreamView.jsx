import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Pressable,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
} from 'react-native';

import { CallingState, SfuEvents, useCall, useCallStateHooks, VideoRenderer } from '@stream-io/video-react-native-sdk';

import CommentCard from '../components/CommentCard/CommentCard';
import BandMemberCard from '../components/BandMemberCard/BandMemberCard';

import { useUser } from '../contexts/UserContext';

import { fireStoreDb } from '../config/firebase';
import {
    collection,
    query,
    where,
    onSnapshot,
    serverTimestamp,
    orderBy,
    doc,
    getDoc,
    addDoc,
    setDoc,
} from 'firebase/firestore';

import { StreamCall, ViewerLivestream } from '@stream-io/video-react-native-sdk';
import { useStreamVideoClient } from '@stream-io/video-react-native-sdk';

import { colors, utilities } from '../styles/utilities';
import { Heart, Play, Send, Pause } from 'lucide-react-native';
import inCallManager from 'react-native-incall-manager';
import ChatTextInput from '../components/ChatTextInput/ChatTextInput';
import StreamViewer from '../components/StreamViewer/StreamViewer';

const StreamView = ({ navigation, route }) => {
    const { show } = route.params;

    console.log(show);

    const { currentUser } = useUser();

    const [userComment, setUserComment] = useState('');
    const [comments, setComments] = useState([]);
    const [videoPlaying, setVideoPlaying] = useState(false);

    const [call, setCall] = useState(null);
    const [viewer, setViewer] = useState(true);
    const [showName, setShowName] = useState(`${show.band.name} @ ${show.venue.name}`);

    const client = useStreamVideoClient();
    const showId = show.id.toString() + 'TEST78';

    client && console.log('Client Found!');
    console.log('Show ID:', show.id);
    console.log('Call:', call);

    useEffect(() => {
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

    const setupCall = async () => {
        if (!client || call) return;

        console.log('Setting up call');
        try {
            const call = client.call('livestream', showId);
            await call.get();
            call && console.log('Call set up!');

            call.setCall(call);
        } catch (error) {
            setVideoPlaying(false);
            console.log('Error setting up Call', error);
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
            await call.join();
            setCall(call);
            console.log('Call joined!', call);
            call && setVideoPlaying(true);
        } catch (error) {
            console.log('Error joining call:', error);
        }
    };

    const handleUserStreamInteraction = () => {
        if (!call) {
            joinCall();
            return;
        } else if (videoPlaying) {
            call.leave();
            setVideoPlaying(false);
        } else {
            joinCall();
            setVideoPlaying(true);
        }
    };

    return (
        <>
            <View style={[utilities.flexed, { backgroundColor: colors.bgDark }]}>
                {call ? (
                    <StreamCall call={call}>
                        <SafeAreaView style={{ flex: 1, marginTop: 64 }}>
                            <StreamViewer viewer={viewer} showName={showName} setCall={setCall} />
                        </SafeAreaView>
                    </StreamCall>
                ) : (
                    <SafeAreaView style={{ flex: 1, marginTop: 64 }}>
                        <Text>No Call Yet</Text>
                        <Pressable
                            onPress={setupCall}
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: [{ translateX: -21 }, { translateY: -21 }],
                            }}
                        >
                            {!videoPlaying ? <Play size={42} color={'white'} /> : <Pause size={42} color={'white'} />}
                        </Pressable>
                    </SafeAreaView>
                )}
            </View>
            {/* <View style={{ flex: 1, position: 'relative' }}>
                {call ? (
                    <StreamCall call={call}>
                        <View style={{ height: height * 0.5 }}>
                            <ViewerLivestream
                                ViewerLeaveStreamButton={null}
                                ViewerLivestreamTopView={null}
                                ViewerLivestreamControls={null}
                            />
                        </View>
                    </StreamCall>
                ) : (
                    <View
                        style={[
                            {
                                height: height * 0.5,
                                backgroundColor: 'black',
                                alignItems: 'center',
                                justifyContent: 'center',
                            },
                        ]}
                    ></View>
                )}
                <Pressable
                    onPress={handleUserStreamInteraction}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: [{ translateX: -21 }, { translateY: -21 }],
                    }}
                >
                    {!videoPlaying ? <Play size={42} color={'white'} /> : <Pause size={42} color={'white'} />}
                </Pressable>
            </View> */}
            <View style={[utilities.flexed, { backgroundColor: colors.bgDark }]}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 20,
                    }}
                >
                    <View>
                        <Text style={[utilities.textCenter, utilities.textL, utilities.textBold]}>
                            {`${show.band.name} Live`}
                        </Text>
                        <Text style={[utilities.textM, { color: colors.gray }]}>{show.venue.name}</Text>
                    </View>
                    <View>
                        <Heart size={24} color={colors.primary} />
                    </View>
                </View>
                <View style={[{ paddingLeft: 20 }]}>
                    <Text style={[utilities.textM, utilities.textBold, { marginBottom: 8 }]}>Band</Text>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        {show.band.members.map((member) => (
                            <BandMemberCard key={member.id} entity={member} />
                        ))}
                    </ScrollView>
                </View>
                <View style={styles.commentsContainer}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {comments.map((comment) => (
                            <CommentCard key={comment._id} avatar={comment.userAvatar} text={comment.text} />
                        ))}
                    </ScrollView>
                </View>

                <KeyboardAvoidingView
                    style={{ height: 48 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
                >
                    <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: colors.bgDark }}>
                        <ChatTextInput
                            placeholder="Write a comment"
                            value={userComment}
                            onChangeText={setUserComment}
                            onSendPress={handlePostComment}
                        />
                    </View>
                </KeyboardAvoidingView>
            </View>
        </>
    );
};

export default StreamView;

const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    commentsContainer: {
        flex: 1,
        paddingTop: 24,
        borderTopEndRadius: 36,
        borderTopStartRadius: 36,
        // borderColor: colors.lightGray,
        // borderWidth: 0.5,
        borderBottomWidth: 0,
    },

    userInputField: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 20,
        height: 48,
        borderTopColor: colors.lightGray,
        borderTopWidth: 1,
    },
});
