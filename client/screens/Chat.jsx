import React, { useState, useLayoutEffect, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, TextInput, Button, Modal } from 'react-native';

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
    updateDoc,
} from 'firebase/firestore';

import { GiftedChat } from 'react-native-gifted-chat';

import { LogOut, PlusIcon, View } from 'lucide-react-native';
import { useUser } from '../contexts/UserContext';

const avatarLocalImg = require('../assets/avatar.png');

const Chat = ({ route }) => {
    const { currentUser } = useUser();
    const { user } = route.params;
    const [messages, setMessages] = useState([]);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [participants, setParticipants] = useState([currentUser?.id, user.id]);
    // const [participants, setParticipants] = useState([auth.currentUser.uid, 'tycoJeTqx2gdJJoyj1MvoE2pFpj1'].sort());
    // const [participants, setParticipants] = useState([auth.currentUser.uid, other].sort());
    const [newParticipantUid, setNewParticipantUid] = useState('');

    console.log('User:', user.id);
    // const otherUserId2 = 'tycoJeTqx2gdJJoyj1MvoE2pFpj1';
    // const otherUserId = 'au2B1vguBTOA2zZQp6VVcGoMt1C2';
    // const participants = [currentUser];

    // if (currentUser !== otherUserId) {
    //     participants.push(otherUserId);
    // } else {
    //     participants.push(otherUserId2);
    // }

    // participants.sort();

    console.log('current user sending chat', currentUser);
    // console.log('participants', participants);

    const getChat = async () => {
        const chatRef = collection(fireStoreDb, 'chats');
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

    const addParticipant = async () => {
        if (newParticipantUid && !participants.includes(newParticipantUid)) {
            const chatRef = getChat();

            if (chatRef) {
                try {
                    await updateDoc(chatRef, {
                        participant_ids: [...participants, newParticipantUid].sort(),
                    });
                } catch (error) {
                    console.error('Error adding participant', error);
                }
            }

            setParticipants([...participants, newParticipantUid]);
            setIsPopupVisible(false);
            setNewParticipantUid('');
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
            await addDoc(messagesRef, {
                _id,
                text,
                createdAt,
                user,
            });
        });

        setMessages((previousMessages) => GiftedChat.append(previousMessages, messages));
    });

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
                        user: doc.data().user,
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
                            onChangeText={setNewParticipantUid}
                            value={newParticipantUid}
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
                    _id: currentUser?.id,
                    avatar: avatarLocalImg,
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
