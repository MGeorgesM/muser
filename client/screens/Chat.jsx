import React, { useState, useLayoutEffect, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, TextInput, Button, Modal } from 'react-native';

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

import { GiftedChat } from 'react-native-gifted-chat';

import { LogOut, PlusIcon, View, ArrowLeft } from 'lucide-react-native';
import { useUser } from '../contexts/UserContext';

const avatarLocalImg = require('../assets/avatar.png');

const Chat = ({ navigation, route }) => {
    const { currentUser } = useUser();
    const { user, chatId } = route.params;
    const [messages, setMessages] = useState([]);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [participants, setParticipants] = useState([currentUser.id, user.id].sort());
    const [newParticipant, setNewParticipant] = useState('');

    console.log('User:', user.id);
    console.log('Current User:', currentUser.id);
    // console.log('participants', participants);

    const getChat = async () => {
        if (chatId) {
            return doc(fireStoreDb, 'chats', chatId);
        } else {
            const chatRef = collection(fireStoreDb, 'chats');
            const q = query(chatRef, where('participantsIds', '==', participants));

            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) return querySnapshot.docs[0].ref;
        }
    };

    const createChat = async () => {
        const newChatRef = doc(collection(fireStoreDb, 'chats'));

        await setDoc(newChatRef, {
            participantsIds: participants,
            chatTitle: null,
            lastMessage: null,
            createdAt: serverTimestamp(),
        });
        return newChatRef;
    };

    const addParticipant = async () => {
        if (newParticipant && !participants.includes(newParticipant)) {
            const chatRef = getChat();

            if (chatRef) {
                try {
                    await updateDoc(chatRef, {
                        participantsIds: [...participants, newParticipant].sort(),
                    });
                } catch (error) {
                    console.error('Error adding participant', error);
                }
            }

            setParticipants([...participants, newParticipant]);
            setIsPopupVisible(false);
            setNewParticipant('');
        }

        console.log('participants', participants);
    };

    const onSend = useCallback(async (messages = []) => {
        let chatRef = await getChat();

        if (!chatRef) {
            chatRef = await createChat();
        }

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

        setMessages((previousMessages) => GiftedChat.append(previousMessages, messages));
    });

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.navigate('ChatMain')}>
                    <ArrowLeft size={24} color="black" />
                </TouchableOpacity>
            ),
        });
    }, []);

    useLayoutEffect(() => {
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
                        user: {
                            _id: doc.data().userId,
                            avatar: null,
                        },
                    }))
                );
            });

            return unsubscribe;
        };

        const unsubscribe = setupMessagesListener();
        return () => unsubscribe.then((unsub) => unsub());
    }, []);

    return (
        <>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isPopupVisible}
                onRequestClose={() => setIsPopupVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TextInput
                            style={styles.input}
                            onChangeText={setNewParticipant}
                            value={newParticipant}
                            placeholder="Enter User UID"
                        />
                        {/* <TouchableOpacity title="Add Participant" onPress={addParticipant} /> */}
                        <TouchableOpacity style={{ margin: 64, height: 32, width: 64 }} onPress={addParticipant}>
                            <Text>Add Participant</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <GiftedChat
                messages={messages}
                onSend={(messages) => onSend(messages)}
                user={{
                    _id: currentUser.id,
                    avatar: currentUser.picture,
                }}
                messagesContainerStyle={{ backgroundColor: '#dbdbdb' }}
            />
        </>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        flex: 1,
        marginTop: 64,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: '80%',
    },
});

export default Chat;
