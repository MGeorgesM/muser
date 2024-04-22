import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';

import { collection, addDoc, orderBy, query, onSnapshot } from 'firebase/firestore';
import { auth, fireStoreDb } from '../config/firebase';

import { GiftedChat } from 'react-native-gifted-chat';

const Chat = () => {
    const [messages, setMessages] = useState([]);

    useLayoutEffect(() => {
        const collectionRef = collection(fireStoreDb, 'chats');
        const q = query(collectionRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            console.log('snapshot:', snapshot);
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
                avatar: 'https://placeimg.com/140/140/any',
            }}
        />
    );
};

export default Chat;
