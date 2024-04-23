import React, { useState, useLayoutEffect, useCallback } from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { auth, fireStoreDb } from '../config/firebase';
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
} from 'firebase/firestore';

import { useUser } from '../contexts/UserContext';

import { GiftedChat } from 'react-native-gifted-chat';

const avatarLocalImg = require('../assets/avatar.png');

const Chat = ({ navigation }) => {
    const [messages, setMessages] = useState([]);
    const { handleSignOut } = useUser();
    const otherUserId = 'tycoJeTqx2gdJJoyj1MvoE2pFpj1';
    const otherUserId2 = 'au2B1vguBTOA2zZQp6VVcGoMt1C2';
    const currentUser = auth.currentUser.uid;

    const getOrCreateChat = async () => {
        const participants = [currentUser];
        if (otherUserId !== currentUser) {
            participants.push(otherUserId);
        } else if (otherUserId2) {
            participants.push(otherUserId2);
        }

        participants.sort();

        const chatRef = collection(fireStoreDb, 'chats');

        console.log('currentuser chat', currentUser);

        const q = query(chatRef, where('participant_ids', '==', participants));

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            const newChatRef = doc(collection(fireStoreDb, 'chats'));
            await setDoc(newChatRef, {
                participant_ids: participants,
                createdAt: serverTimestamp(),
            });
            return newChatRef;
        } else {
            return querySnapshot.docs[0].ref;
        }
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={handleSignOut}>
                    <Text>Logout</Text>
                </TouchableOpacity>
            ),
        });

        const setupMessagesListener = async () => {
            const chatRef = await getOrCreateChat();
            const messagesRef = collection(chatRef, 'messages');
            const q = query(messagesRef, orderBy('createdAt', 'desc'));

            const unsubscribe = onSnapshot(q, (snapshot) => {
                setMessages(
                    snapshot.docs.map((doc) => ({
                        _id: doc.id,
                        text: doc.data().text,
                        createdAt: doc.data().createdAt.toDate(),
                        user: doc.data().user,
                    }))
                );
            });

            return unsubscribe;
        };

        // const collectionRef = collection(fireStoreDb, 'chats');
        // const q = query(collectionRef, orderBy('createdAt', 'desc'));

        // const unsubscribe = onSnapshot(q, (snapshot) => {
        //     setMessages(
        //         snapshot.docs.map((doc) => ({
        //             _id: doc.id,
        //             text: doc.data().text,
        //             createdAt: doc.data().createdAt.toDate(),
        //             user: doc.data().user,
        //         }))
        //     );
        // });

        // return unsubscribe;

        const unsubscribe = setupMessagesListener();
        return () => unsubscribe.then((unsub) => unsub());
    }, []);

    const onSend = useCallback(async (messages = []) => {
        // setMessages((previousMessages) => GiftedChat.append(previousMessages, messages));

        // const { _id, text, createdAt, user } = messages[0];
        // addDoc(collection(fireStoreDb, 'chats'), {
        //     _id,
        //     text,
        //     createdAt,
        //     user,
        // });

        const chatRef = await getOrCreateChat();

        if (!chatRef) return;

        const messagesRef = collection(chatRef, 'messages');

        messages.forEach(async (message) => {
            const { _id, text, createdAt, user } = message;
            await addDoc(messagesRef, {
                _id,
                text,
                createdAt,
                user,
            });
        });

        setMessages((previousMessages) => GiftedChat.append(previousMessages, messages));
    });

    return (
        <GiftedChat
            messages={messages}
            onSend={(messages) => onSend(messages)}
            user={{
                _id: auth.currentUser.uid,
                avatar: avatarLocalImg,
            }}
            messagesContainerStyle={{ backgroundColor: '#dbdbdb' }}
        />
    );
};

export default Chat;
