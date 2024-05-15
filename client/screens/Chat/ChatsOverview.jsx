import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, FlatList } from 'react-native';

import { useUser } from '../../contexts/UserContext';

import { fireStoreDb } from '../../config/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

import { colors, utilities } from '../../styles/utilities';

import ChatCard from '../../components/Cards/ChatCard/ChatCard';
import LoadingScreen from '../../components/Misc/LoadingScreen/LoadingScreen';

const ChatsOverview = ({ navigation }) => {
    const [chats, setChats] = useState([]);
    const { currentUser } = useUser();
    const [isLoading, setIsLoading] = useState(true);

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
            querySnapshot.forEach((doc) => {
                chatsArray.push({ id: doc.id, ...doc.data() });
            });

            console.log('Chat Overview Is Updating')

            chatsArray.sort((a, b) => b.lastMessage.createdAt - a.lastMessage.createdAt);
            setChats(chatsArray);
            setIsLoading(false);

            if (!querySnapshot.empty) {
                return querySnapshot.docs[0].ref;
            }

            return null;
        });

        return () => unsubscribe;
    }, [currentUser]);

    return isLoading ? (
        <View style={[utilities.container, { backgroundColor: colors.bgDark }]}>
            <LoadingScreen />
        </View>
    ) : chats && chats.length > 0 ? (
        <View style={[utilities.darkContainer]}>
            <FlatList
                style={[utilities.flexed]}
                data={chats}
                renderItem={({ item }) => <ChatCard chat={item} navigation={navigation} />}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
            />
        </View>
    ) : (
        <LoadingScreen message={'Start Connecting!'} />
    );
};

export default ChatsOverview;
