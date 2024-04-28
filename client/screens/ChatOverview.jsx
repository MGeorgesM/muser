import React, { useEffect, useState, useLayoutEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native';
import { colors, utilities } from '../styles/utilities';

import { useUser } from '../contexts/UserContext';
import { fireStoreDb } from '../config/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { requestMethods, sendRequest } from '../core/tools/apiRequest';

const ChatOverview = ({ navigation }) => {
    const [chats, setChats] = useState([]);
    const { currentUser } = useUser();

    const firebaseChatsResult = [
        {
            chatTitle: null,
            // createdAt: [Object],
            id: 'WifCfU3y2PznwQ82hFmd',
            lastMessage: {
                // createdAt: [Timestamp],
                messageId: 'DxB8kOLz3meCskiqqJPk',
                text: "I don't know",
                userId: 16,
            },
            participantsIds: [16, 17],
        },
        {
            chatTitle: null,
            // createdAt: [Object],
            id: 'WifCfU3y2PznwQ82hFmd',
            lastMessage: {
                // createdAt: [Timestamp],
                messageId: 'DxB8kOLz3meCskiqqJPk',
                text: "I don't know",
                userId: 16,
            },
            participantsIds: [16, 2],
        },
    ];

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: 'Chats',
        });
    });

    useLayoutEffect(() => {
        const chatRef = collection(fireStoreDb, 'chats');
        const q = query(chatRef, where('participantsIds', 'array-contains', currentUser.id));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const chatsArray = [];
            console.log('Snapshot size:', querySnapshot.size);
            querySnapshot.forEach((doc) => {
                chatsArray.push({ id: doc.id, ...doc.data() });
            });

            setChats(chatsArray);
            console.log(currentUser.id);
            console.log(chatsArray);

            if (querySnapshot.empty) {
                return;
            } else {
                return querySnapshot.docs[0].ref;
            }
        });

        return () => unsubscribe;
    }, []);

    const ChatCard = ({ chat }) => {
        const [title, setTitle] = useState(chat.chatTitle);
        const [avatar, setAvatar] = useState(null);

        //if chatTitle is null get the name of the participants (excluding currentuser) then display the names as the chatTitle (api call)
        //if chatTitle is not null, display the chatTitle
        //display last message text and time
        //if participatsIds.length > 2, the avatar should be a group icon (fixed image for now)
        //if participatsIds.length === 2, display the avatar of the other participant (api call)

        useEffect(() => {
            const getUsersPicutresandNames = async () => {
                const otherParticipantIds = chat.participantsIds.filter((id) => id !== currentUser.id);

                if (otherParticipantIds.length === 0) return;

                const query = otherParticipantIds.map((id) => `ids[]=${id}`).join('&');

                try {
                    const response = await sendRequest(requestMethods.GET, `users/details?${query}`, null);
                    if (response.status !== 200) throw new Error('Failed to fetch users');
                    console.log('Users fetched:', response.data);

                    setTitle(response.data.map((user) => user.name).join(', '));
                    setAvatar(response.data[0].picture);
                } catch (error) {
                    console.log('Error fetching users:', error);
                }
            };

            if (!chat.chatTitle) {
                getUsersPicutresandNames();
            } else {
                setTitle(chat.chatTitle);
                setAvatar('../assets/avatar.png');
            }
        }, [chat]);

        return (
            <TouchableOpacity
                style={styles.chatCardContainer}
                onPress={() => navigation.navigate('ChatDetails', { chat })}
            >
                <View style={[utilities.flexRow, utilities.center]}>
                    <Image source={{ uri: avatar }} style={styles.photo} />
                    <View>
                        <Text style={[utilities.textM, utilities.textBold, { color: colors.black }]}>
                            {title || 'Chat'}
                        </Text>
                        <Text style={[utilities.textXS, { color: colors.gray }]}>{chat.lastMessage.text}</Text>
                    </View>
                </View>
                <View>
                    <Text style={[utilities.textXS, { color: colors.gray }]}>
                        {new Date(chat.lastMessage.createdAt.seconds * 1000).toLocaleString()}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <FlatList
            style={utilities.container}
            data={chats}
            renderItem={({ item }) => <ChatCard chat={item} />}
            keyExtractor={(item) => item._id}
        />
    );
};

export default ChatOverview;

const styles = StyleSheet.create({
    chatCardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 20,
    },
    photo: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
});
