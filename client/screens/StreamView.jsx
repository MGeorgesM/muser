import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView, TextInput, TouchableOpacity } from 'react-native';

import BackBtn from '../components/Elements/BackBtn';
import CommentCard from '../components/CommentCard/CommentCard';
import BandMemberCard from '../components/BandMemberCard/BandMemberCard';

import { useUser } from '../contexts/UserContext';

import { fireStoreDb } from '../config/firebase';
import { collection, query, where, onSnapshot, serverTimestamp } from 'firebase/firestore';

import { truncateText } from '../core/tools/formatDate';
import { colors, utilities } from '../styles/utilities';
import { Heart, Play, PlayIcon, Send } from 'lucide-react-native';

const StreamView = ({ navigation, route }) => {
    const { show } = route.params;

    const { currentUser } = useUser();

    const [userComment, setUserComment] = useState('');
    const [comments, setComments] = useState([]);
    const [showCommentsRef, setShowCommentsRef] = useState(null);


    useEffect(() => {
        const commentsRef = collection(fireStoreDb, 'shows', show.id, 'comments');
        const q = query(commentsRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedComments = querySnapshot.docs.map((doc) => ({
                _id: doc.id,
                text: doc.data().text,
                createdAt: doc.data().createdAt.toDate(),
                user: {
                    _id: doc.data().userId,
                },
            }));
            setComments(fetchedComments);
        });

        return () => unsubscribe();
    }, [show.id]);

    const createShowAndComments = async (initialComment) => {
        const newShowRef = doc(collection(fireStoreDb, 'shows'));
        const commentsRef = collection(newShowRef, 'comments');

        await addDoc(commentsRef, {
            text: initialComment,
            createdAt: serverTimestamp(),
            userId: currentUser.id,
        });

        await setDoc(newShowRef, {
            showId: show.id,
            createdAt: serverTimestamp(),
        });

        return newShowRef;
    };

    const onSend = useCallback(
        async (newComments = []) => {
            let showRef = doc(fireStoreDb, 'shows', show.id);
            const showSnapshot = await getDoc(showRef);

            if (!showSnapshot.exists()) {
                const initialComment = newComments[0];
                showRef = await createShowAndComments(initialComment);
            } else {
                const commentsRef = collection(showRef, 'comments');
                for (const message of newComments) {
                    await addDoc(commentsRef, {
                        text: message.text,
                        createdAt: serverTimestamp(),
                        userId: currentUser.id,
                    });
                }
            }

            setComments((prevComments) => [
                ...prevComments,
                ...newComments.map((comment) => ({
                    _id: comment._id,
                    userId: currentUser.id,
                    text: comment.text,
                    createdAt: new Date(),
                })),
            ]);
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
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {comments.map((comment) => (
                            <CommentCard key={comment._id} comment={comment}  />
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
