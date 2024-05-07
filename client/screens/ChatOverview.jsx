import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, FlatList, Text } from 'react-native';

import { useUser } from '../contexts/UserContext';

import { fireStoreDb } from '../config/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

import { colors, utilities } from '../styles/utilities';

import ChatCard from '../components/Cards/ChatCard/ChatCard';
import LoadingScreen from '../components/LoadingScreen/LoadingScreen';

const ChatOverview = ({ navigation }) => {
    const [chats, setChats] = useState([]);
    const { currentUser } = useUser();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: 'Your Connections',
        });
    });

    useEffect(() => {
        if (!currentUser) return;
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
            console.log('Chats:', chatsArray);
            setChats(chatsArray);

            if (!querySnapshot.empty) {
                return querySnapshot.docs[0].ref;
            }

            return null;
        });

        return () => unsubscribe;
    }, [currentUser]);

    return chats.length === 0 ? (
        <View style={[utilities.container, {backgroundColor:colors.bgDark}]}>
            <LoadingScreen message={'Start Connecting!'} />
        </View>
    ) : (
        <View style={[utilities.darkContainer]}>
            <FlatList
                style={[utilities.flexed]}
                data={chats}
                renderItem={({ item }) => <ChatCard chat={item} navigation={navigation} />}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
};

export default ChatOverview;
