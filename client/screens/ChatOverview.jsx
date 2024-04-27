import React, { useEffect, useState, useLayoutEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native';
import { colors, utilities } from '../styles/utilities';

import { fireStoreDb } from '../config/firebase';
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    addDoc,
    serverTimestamp,
    doc,
    setDoc,
    getDocs,
    updateDoc,
} from 'firebase/firestore';

const ChatOverview = ({ navigation }) => {
    const [chats, setChats] = useState([]);
    const currentUserID = 16;

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: 'Chats',
        });
    });

    useLayoutEffect(() => {
        const chatRef = collection(fireStoreDb, 'chats');
        const q = query(chatRef, where('participant_ids', 'array-contains', currentUserID));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const chatsArray = [];
            console.log("Snapshot size:", querySnapshot.size); 
            querySnapshot.forEach((doc) => {
                chatsArray.push({ id: doc.id, ...doc.data() });
            });

            setChats(chatsArray);
            console.log(currentUserID);
            console.log(chatsArray)

            if (querySnapshot.empty) {
                return;
            } else {
                return querySnapshot.docs[0].ref;
            }
        });


        return () => unsubscribe;
    },[]);

    const ChatCard = ({ chat }) => {
        return (
            <TouchableOpacity
                style={styles.chatCardContainer}
                onPress={() => navigation.navigate('ChatDetails', { chat })}
            >
                <View style={[utilities.flexRow, utilities.center]}>
                    <Image source={{ uri: chat.photo }} style={styles.photo} /> 
                    <View>
                        <Text style={[utilities.textM, utilities.textBold, { color: colors.black }]}>{chat.username}</Text>
                        <Text style={[utilities.textXS, { color: colors.gray }]}>
                            {chat.lastMessage.text}
                        </Text>
                    </View>
                </View>
                <View>
                    <Text style={[utilities.textXS, { color: colors.gray }]}>{chat.lastMessage.createdAt}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        // <FlatList
        //     style={utilities.container}
        //     data={chats}
        //     renderItem={({ item }) => <ChatCard chat={item} />}
        //     keyExtractor={(item) => item?.username}
        // ></FlatList>

        <View style={utilities.container}>
            <Text>Chats</Text>
        </View>
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
