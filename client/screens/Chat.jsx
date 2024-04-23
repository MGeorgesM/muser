import React, { useState, useLayoutEffect, useCallback } from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { auth, fireStoreDb } from '../config/firebase';
import { collection, addDoc, orderBy, query, onSnapshot } from 'firebase/firestore';

import { useUser } from '../contexts/UserContext';

import { GiftedChat } from 'react-native-gifted-chat';

const avatarLocalImg = require('../assets/avatar.png');

const Chat = ({ navigation }) => {
    const [messages, setMessages] = useState([]);

    const { handleSignOut } = useUser();

    // const handleLogout = async () => {
    //     await auth.signOut();
    //     navigation.navigate('SignIn');
    // };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={handleSignOut}>
                    <Text>Logout</Text>
                </TouchableOpacity>
            ),
        });
        
        const collectionRef = collection(fireStoreDb, 'chats');
        const q = query(collectionRef, orderBy('createdAt', 'desc'));

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
    }, []);

    const onSend = useCallback((messages = []) => {
        setMessages((previousMessages) => GiftedChat.append(previousMessages, messages));

        const { _id, text, createdAt, user } = messages[0];
        addDoc(collection(fireStoreDb, 'chats'), {
            _id,
            text,
            createdAt,
            user,
        });
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
