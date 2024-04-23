import React, { useState, useLayoutEffect, useCallback } from 'react';
import { Text, TouchableOpacity, TextInput, Button, Modal } from 'react-native';

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

import { LogOut, PlusIcon } from 'lucide-react-native';

const avatarLocalImg = require('../assets/avatar.png');

const Chat = ({ navigation }) => {
    const [messages, setMessages] = useState([]);
    const [participants, setParticipants] = useState([auth.currentUser.uid, 'tycoJeTqx2gdJJoyj1MvoE2pFpj1'].sort());
    const { handleSignOut } = useUser();

    const otherUserId2 = 'au2B1vguBTOA2zZQp6VVcGoMt1C2';
    const currentUser = auth.currentUser.uid;

    const getChat = async () => {
        const chatRef = collection(fireStoreDb, 'chats');

        console.log('current user sending chat', currentUser);

        const q = query(chatRef, where('participant_ids', '==', participants));

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return;
        } else {
            return querySnapshot.docs[0].ref;
        }
    };

    const createChat = async () => {
        const newChatRef = doc(collection(fireStoreDb, 'chats'));
        await setDoc(newChatRef, {
            participant_ids: participants,
            createdAt: serverTimestamp(),
        });
        return newChatRef;
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
            const chatRef = await getChat();

            if (!chatRef) return;

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

        const unsubscribe = setupMessagesListener();
        return () => unsubscribe.then((unsub) => unsub());
    }, []);

    const onSend = useCallback(async (messages = []) => {
        let chatRef = await getChat();

        if (!chatRef) {
            chatRef = await createChat();
        }

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
