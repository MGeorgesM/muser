import React, { useEffect, useState, useRef } from 'react';
import { View, SafeAreaView, ScrollView, StyleSheet, Animated, Dimensions } from 'react-native';

import { useStreamVideoClient } from '@stream-io/video-react-native-sdk';

import { StreamCall } from '@stream-io/video-react-native-sdk';
import { colors, utilities } from '../../styles/utilities';
import StreamViewer from '../../components/Misc/Streaming/StreamViewer/StreamViewer';
import LoadingScreen from '../../components/Misc/LoadingScreen/LoadingScreen';
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
import CommentCard from '../../components/Cards/CommentCard/CommentCard';

const ShowBroadcast = ({ route }) => {
    const { showId, showName } = route.params;
    // const showIdString = showId.toString() + 'TEST78' ?? {};
    const showIdString = 'TEST1122334XX';

    const [call, setCall] = useState(null);
    const [comments, setComments] = useState([]);
    const [viewer, setViewer] = useState(false);

    const client = useStreamVideoClient();

    const fadeAnim = useRef(new Animated.Value(1)).current;


    client && console.log('Client Found!');
    console.log('orifinal show id', showId);
    console.log('Show ID:', showIdString);

    useEffect(() => {
        let unsubscribeComments = () => {};

        const initializeListeners = async () => {
            unsubscribeComments = await setupCommentsListener();
        };

        initializeListeners();
        createCall();

        return () => {
            unsubscribeComments();
        };
    }, [showId]);

    const setupCommentsListener = async () => {
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
            console.log('fetchedcommets:', fetchedComments);
            setComments(fetchedComments);
        });

        return unsubscribeComments;
    };

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

    return call ? (
        <View style={[utilities.flexed, { backgroundColor: colors.bgDark }]}>
            <StreamCall call={call}>
                <SafeAreaView style={{ flex: 1, marginTop: 64, position:'relative' }}>
                    <StreamViewer viewer={viewer} showName={showName} setCall={setCall} />
                    <ScrollView showsVerticalScrollIndicator={false} style={styles.commentsContainer}>
                        {comments && comments.length > 0 && (
                            comments.map((comment) => (
                                <CommentCard key={comment._id} avatar={comment.userAvatar} text={comment.text} />
                            ))
                        )}
                    </ScrollView>
                </SafeAreaView>
            </StreamCall>
        </View>
    ) : (
        <LoadingScreen />
    );
};

export default ShowBroadcast;

const styles = StyleSheet.create({
    commentsContainer: {
        position: 'absolute',
        height: 64,
        bottom: 48,

    },
})
