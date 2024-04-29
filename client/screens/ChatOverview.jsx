import React, { useEffect, useState, useLayoutEffect } from 'react';
import { FlatList } from 'react-native';

import { utilities } from '../styles/utilities';

import { useUser } from '../contexts/UserContext';

import { fireStoreDb } from '../config/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

import ChatCard from '../components/ChatCard/ChatCard';

const ChatOverview = ({ navigation }) => {
    const [chats, setChats] = useState([]);
    const { currentUser } = useUser();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: 'Chats',
        });
    });

    useEffect(() => {
        const chatRef = collection(fireStoreDb, 'chats');
        const q = query(chatRef, where('participantsIds', 'array-contains', currentUser.id));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const chatsArray = [];

            // console.log('Snapshot size:', querySnapshot.size);
            querySnapshot.forEach((doc) => {
                // console.log('raw data:', doc.data());
                chatsArray.push({ id: doc.id, ...doc.data() });
            });

            chatsArray.sort((a, b) => b.lastMessage.createdAt - a.lastMessage.createdAt);
            setChats(chatsArray);

            if (!querySnapshot.empty) {
                return querySnapshot.docs[0].ref;
            }

            return null;
        });

        return () => unsubscribe;
    }, []);

    return (
        <FlatList
            style={utilities.container}
            data={chats}
            renderItem={({ item }) => <ChatCard chat={item} navigation={navigation} />}
            keyExtractor={(item) => item.id}
        />
    );
};

export default ChatOverview;
