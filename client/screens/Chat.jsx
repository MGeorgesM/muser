import React, { useState, useLayoutEffect, useCallback } from 'react';
import { TouchableOpacity } from 'react-native';

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
    getDoc,
    getDocs,
    updateDoc,
} from 'firebase/firestore';

import { GiftedChat } from 'react-native-gifted-chat';

import { PlusIcon, View, ArrowLeft } from 'lucide-react-native';
import { useUser } from '../contexts/UserContext';

const Chat = ({ navigation, route }) => {
    const { currentUser } = useUser();
    const { user, chatId, chatParticipants } = route.params;
    const [messages, setMessages] = useState([]);
    // const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [participants, setParticipants] = useState(
        chatParticipants.length > 1 ? chatParticipants : [currentUser.id, user?.id].sort()
    );
    const [newParticipant, setNewParticipant] = useState(17);
    const [bandName, setBandName] = useState('The Jazzy Brazzy')

    console.log('User:', user?.id);
    console.log('Current User:', currentUser.id);

    // console.log('participants', participants);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.navigate('ChatMain')}>
                    <ArrowLeft size={24} color="black" />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <TouchableOpacity onPress={addParticipant}>
                    <PlusIcon size={24} color="black" />
                </TouchableOpacity>
            ),
        });
        console.log('chatparticipant in chat ', chatParticipants);
    }, []);

    useLayoutEffect(() => {
        let unsubscribe;

        const setupMessagesListener = async () => {
            const chatRef = await getChat();
            if (!chatRef) return;

            const messagesRef = collection(chatRef, 'messages');
            const q = query(messagesRef, orderBy('createdAt', 'desc'));

            unsubscribe = onSnapshot(q, (snapshot) => {
                const fetchedMessages = snapshot.docs.map((doc) => ({
                    _id: doc.id,
                    text: doc.data().text,
                    createdAt: doc.data().createdAt.toDate(),
                    user: {
                        _id: doc.data().userId,
                        avatar: null,
                    },
                }));
                setMessages(fetchedMessages);
            });
        };

        setupMessagesListener();

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [chatId]);

    const getChat = async () => {
        if (chatId) {
            const chatRef = doc(fireStoreDb, 'chats', chatId);
            // try {
            //     const docSnap = await getDoc(chatRef);
            //     if(docSnap.exists()) {
            //         const chatData = docSnap.data();
            //         setParticipants(chatData.participantsIds);
            //         console.log('participants:', chatData.participantsIds)
            //     }
            // } catch (error) {
            //     console.log('Error getting chat:', error)
            // }
            return chatRef;
        } else {
            const chatRef = collection(fireStoreDb, 'chats');
            const q = query(chatRef, where('participantsIds', '==', participants));

            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) return querySnapshot.docs[0].ref;
        }
    };

    const addParticipant = async () => {
        if (newParticipant && !participants.includes(newParticipant)) {
            const chatRef = await getChat();
            if (chatRef) {
                try {
                    const newParticipantsList = [...participants, newParticipant].sort();
                    console.log('New participants:', newParticipantsList);
                    await updateDoc(chatRef, {
                        participantsIds: newParticipantsList,
                    });

                    setParticipants([...participants, newParticipant]);
                    // setIsPopupVisible(false);
                    // setNewParticipant('');
                } catch (error) {
                    console.error('Error adding participant', error);
                }
            }
        }
    };

    const createChat = async (initialMessage) => {
        const newChatRef = doc(collection(fireStoreDb, 'chats'));
        const messageRef = collection(newChatRef, 'messages');

        const messageDocRef = await addDoc(messageRef, {
            _id: initialMessage._id,
            text: initialMessage.text,
            createdAt: initialMessage.createdAt,
            userId: initialMessage.user._id,
        });

        await setDoc(newChatRef, {
            participantsIds: participants,
            chatTitle: null,
            lastMessage: {
                messageId: messageDocRef.id,
                text: initialMessage.text,
                createdAt: initialMessage.createdAt,
                userId: initialMessage.user._id,
            },
            createdAt: serverTimestamp(),
        });
        return newChatRef;
    };

    const onSend = useCallback(async (messages = []) => {
        let chatRef = await getChat();

        if (!chatRef) {
            const firstMessage = messages[0];
            chatRef = await createChat(firstMessage);
        } else {
            const messagesRef = collection(chatRef, 'messages');

            messages.forEach(async (message) => {
                const { _id, text, createdAt, user } = message;
                const messageDocRef = await addDoc(messagesRef, {
                    _id,
                    text,
                    createdAt,
                    userId: user._id,
                });

                await updateDoc(chatRef, {
                    lastMessage: {
                        messageId: messageDocRef.id,
                        text,
                        createdAt,
                        userId: user._id,
                    },
                });
            });
        }

        setMessages((previousMessages) => GiftedChat.append(previousMessages, messages));
    });

    return (
        <GiftedChat
            messages={messages}
            onSend={(messages) => onSend(messages)}
            user={{
                _id: currentUser.id,
                // avatar: null,
            }}
            messagesContainerStyle={{ backgroundColor: '#dbdbdb' }}
        />
    );
};
export default Chat;
