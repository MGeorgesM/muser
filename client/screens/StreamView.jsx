import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView, TextInput, TouchableOpacity } from 'react-native';

import BackBtn from '../components/Elements/BackBtn';
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

import { truncateText } from '../core/tools/formatDate';
import { colors, utilities } from '../styles/utilities';
import { Heart, Play, Send } from 'lucide-react-native';

const StreamView = ({ navigation, route }) => {
    const { show } = route.params;

    const { currentUser } = useUser();

    const [userComment, setUserComment] = useState('');
    const [comments, setComments] = useState([]);
    const [showCommentsRef, setShowCommentsRef] = useState(null);

    const [call, setCall] = useState(null);

    const client = useStreamVideoClient();
    const showId = show.id.toString() + 'TEST0';

    client && console.log('Client Found!');
    console.log('Show ID:', show.id);
    console.log('Call:', call);

    useLayoutEffect(() => {
        if (!client || call) return;

        const setupCall = async () => {
            console.log('Setting up call');
            try {
                const call = client.call('livestream', showId);
                await call.get();
                call && console.log('Call set up!');
                setCall(call);
            } catch (error) {
                console.log('Error setting up Call', error);
            }
        };

        setupCall();
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

            // setComments((prevComments) => [
            //     ...prevComments,
            //     ...newComments.map((comment) => ({
            //         _id: comment._id,
            //         userId: currentUser.id,
            //         text: comment.text,
            //         createdAt: new Date(),
            //     })),
            // ]);

            // setComments((prevComments) => [
            //     ...prevComments,
            //     { text: comment, createdAt: new Date(), userId: currentUser.id, userAvatar: currentUser.picture },
            // ]);
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

    return (
        // <StreamCall call={call}>
        <View style={{ flex: 1 }}>
            <BackBtn navigation={navigation} />
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
                {call && (
                    <StreamCall call={call}>
                        <ViewerLivestream
                            ViewerLivestreamTopView={null}
                            ViewerLeaveStreamButton={null}
                            ViewerLivestreamControls={null}
                        />
                    </StreamCall>
                )}
                <Play size={42} color={'white'} />
            </View>
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
                        {truncateText(show.name)}
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
                <View style={styles.userInputField}>
                    <TextInput
                        placeholder="Write a comment"
                        value={userComment}
                        onChangeText={(text) => setUserComment(text)}
                        style={{ paddingHorizontal: 20, paddingVertical: 10, backgroundColor: colors.white }}
                    />
                    <TouchableOpacity onPress={handlePostComment}>
                        <Send size={24} color={colors.darkGray} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        // </StreamCall>
    );
};

export default StreamView;

const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    commentsContainer: {
        marginTop: 8,
        paddingTop: 24,
        borderTopEndRadius: 36,
        borderTopStartRadius: 36,
        flex: 1,
        border: colors.lightGray,
        borderWidth: 0.25,
        // elevation: 1,
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
