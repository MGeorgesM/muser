import React, { useEffect, useState } from 'react';
import { View, SafeAreaView } from 'react-native';

import { useStreamVideoClient } from '@stream-io/video-react-native-sdk';

import { StreamCall } from '@stream-io/video-react-native-sdk';
import { colors, utilities } from '../../styles/utilities';

import { fireStoreDb } from '../../config/firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';

import StreamViewer from '../../components/Misc/Streaming/StreamViewer/StreamViewer';
import LoadingScreen from '../../components/Misc/LoadingScreen/LoadingScreen';

const ShowBroadcast = ({ route }) => {
    const { showId, showName } = route.params;
    // const showIdString = showId.toString() + 'TEST78' ?? {};
    const showIdString = 'TEST1122334XX';

    const [call, setCall] = useState(null);
    const [comments, setComments] = useState([]);

    const client = useStreamVideoClient();

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
    };

    return call ? (
        <View style={[utilities.flexed, { backgroundColor: colors.bgDark }]}>
            <StreamCall call={call}>
                <SafeAreaView style={{ flex: 1, marginTop: 64, position: 'relative' }}>
                    <StreamViewer showName={showName} setCall={setCall} comments={comments} />
                </SafeAreaView>
            </StreamCall>
        </View>
    ) : (
        <LoadingScreen />
    );
};

export default ShowBroadcast;
