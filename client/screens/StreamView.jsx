import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, ScrollView, TextInput, TouchableOpacity } from 'react-native';

import { Heart, Play, PlayIcon, Send } from 'lucide-react-native';
import { colors, utilities } from '../styles/utilities';
import BackBtn from '../components/Elements/BackBtn';
import BandMemberCard from '../components/BandMemberCard/BandMemberCard';
import { defaultAvatar } from '../core/tools/apiRequest';

import { useUser } from '../contexts/UserContext';

import { fireStoreDb } from '../config/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

import { formatDateString, truncateText } from '../core/tools/formatDate';

const StreamView = ({ navigation, route }) => {
    const { show } = route.params;

    const { currentUser } = useUser();

    const [comments, setComments] = useState([]);
    const [showCommentsRef, setShowCommentsRef] = useState(null);

    useEffect(() => {
        const showCommentsRef = collection(fireStoreDb, 'shows', show.id, 'comments');
        const q = query(showCommentsRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const comments = [];

            console.log('Snapshot size:', querySnapshot.size);
            querySnapshot.forEach((doc) => {
                console.log('raw data:', doc.data());
                comments.push({ id: doc.id, ...doc.data() });
            });

            comments.sort((a, b) => b.lastMessage.createdAt - a.lastMessage.createdAt);
            setComments(comments);

            if (!querySnapshot.empty) {
                return querySnapshot.docs[0].ref;
            }

            return null;
        });

        return () => unsubscribe;
    }, [show.id]);

    useEffect(() => {
        let unsubscribe;

        const setUpCommentsListener = async () => {
            const commentsRef = collection(fireStoreDb, 'shows', show.id, 'comments');
            const queryRef = query(commentsRef, orderBy('createdAt', 'desc'));

            unsubscribe = onSnapshot(q, (snapshot) => {
                const fetchedComments = snapshot.docs.map((doc) => ({
                    _id: doc.id,
                    text: doc.data().text,
                    createdAt: doc.data().createdAt.toDate(),
                    user: {
                        _id: doc.data().userId,
                    },
                }));
                setComments(fetchedComments);
            });
        };

        setUpCommentsListener();

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [show.id]);

    const createShowAndComments = async (initialComment) => {
        const newShowRef = doc(collection(fireStoreDb, 'chats'));
        const commentsRef = collection(newShowRef, 'comments');

        await addDoc(commentsRef, {
            text: initialComment.text,
            createdAt: serverTimestamp(),
            userId: currentUser.id,
        });

        await setDoc(newShowRef, {
            showId: show.Id,
            createdAt: serverTimestamp(),
        });

        return newShowRef;
    };

    const onSend = useCallback(async (messages = []) => {
        let showCommentsRef = await getChat();
        if (!showCommentsRef) {
            const firstMessage = messages[0];
            showCommentsRef = await createChat(firstMessage);
            await addConnection();
        } else {
            const commentsRef = collection(showCommentsRef, 'messages');

            messages.forEach(async (message) => {
                const { _id, text, createdAt, user } = message;
                const messageDocRef = await addDoc(commentsRef, {
                    _id,
                    text,
                    createdAt,
                    userId: user._id,
                });

                await updateDoc(showCommentsRef, {
                    lastMessage: {
                        messageId: messageDocRef.id,
                        text,
                        createdAt,
                        userId: user._id,
                    },
                });
            });
        }

        setComments((previousComments) => );
    });

    // const handlePostComment = () => {
    //     console.log('Posting comment');
    // };

    if (show)
        return (
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
                    <PlayIcon size={42} color={'white'} />
                </View>
                <View
                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 }}
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
                    <ScrollView showsVerticalScrollIndicator={false}></ScrollView>
                    <View style={styles.userInputField}>
                        <TextInput
                            placeholder="Write a comment"
                            style={{ paddingHorizontal: 20, paddingVertical: 10, backgroundColor: colors.white }}
                        />
                        <TouchableOpacity onPress={handlePostComment}>
                            <Send size={24} color={colors.darkGray} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
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

    commentAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
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
