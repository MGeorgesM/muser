import React, { useState, useLayoutEffect, useCallback, useEffect } from 'react';
import { TouchableOpacity, Image, View, StyleSheet, Dimensions } from 'react-native';

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

import { PlusIcon, ArrowLeft, Send as SendIcon, ChevronLeft } from 'lucide-react-native';
import { GiftedChat, Bubble, Send, InputToolbar, Composer } from 'react-native-gifted-chat';
import { renderBubble, renderSend, renderInputToolbar } from '../core/tools/chatConfigurations';

import { useDispatch, useSelector } from 'react-redux';
import { addConnectedUser } from '../store/Users';
import { useUser } from '../contexts/UserContext';

import { defaultAvatar } from '../core/tools/apiRequest';
import { sendRequest, requestMethods } from '../core/tools/apiRequest';

import PictureHeader from '../components/PictureHeader/PictureHeader';
import { colors } from '../styles/utilities';
import { ScrollView } from 'react-native-gesture-handler';

const Chat = ({ navigation, route }) => {
    const { currentUser } = useUser();
    const { chatId, chatParticipants } = route.params;

    const [messages, setMessages] = useState([]);
    const [participants, setParticipants] = useState(chatParticipants);
    const [newParticipant, setNewParticipant] = useState(16);
    const [receiver, setReceiver] = useState(null);

    const userConnections = useSelector((global) => global.usersSlice.connectedUsers);

    useEffect(() => {
        setParticipants(chatParticipants);
        console.log('Chat participants:', chatParticipants);
    }, [chatParticipants]);

    useEffect(() => {
        const getUsersPicutresandNames = async () => {
            const otherParticipantIds = participants.filter((id) => id !== currentUser.id);

            if (otherParticipantIds.length === 0) return;

            const query = otherParticipantIds.map((id) => `ids[]=${id}`).join('&');

            try {
                const response = await sendRequest(requestMethods.GET, `users/details?${query}`, null);
                if (response.status !== 200) throw new Error('Failed to fetch users');
                setReceiver(response.data);
                console.log('Users fetched:', response.data);
            } catch (error) {
                console.log('Error fetching users:', error);
            }
        };

        const getUserConnections = async () => {
            try {   
                const response = await sendRequest(requestMethods.GET, 'connections', null);
                if (response.status !== 200) throw new Error('Failed to fetch connections');
                dispatch(setConnectedUsers(response.data));
            } catch (error) {
                console.log('Error fetching connections:', error);
            }
        }
        
        getUsersPicutresandNames();
    }, [participants]);

    useLayoutEffect(() => {
        console.log('receiver', receiver);
        navigation.setOptions({
            headerTitle: () => <PictureHeader picture={receiver?.picture} name={receiver?.name} />,
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.navigate('ChatMain')} style={{ marginLeft: 20 }}>
                    <ChevronLeft size={24} color="white" />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <TouchableOpacity onPress={addParticipant} style={{ marginRight: 20 }}>
                    <PlusIcon size={24} color="white" />
                </TouchableOpacity>
            ),
            headerStyle: {
                backgroundColor: colors.bgDark,
                height: 128,
                shadowColor: 'transparent',
                elevation: 0,
            },
        });
    }, [navigation, addParticipant, receiver]);

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
                        avatar: participants.length === 2 ? null : defaultAvatar,
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
    }, [participants, chatId]);

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
            // const q = query(chatRef, where(`participantsIds.${participants[0]}`, '==', true));

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

    const addConnection = async () => {
        const receiverId = participants.find((id) => id !== currentUser.id);
        try {
            const response = await sendRequest(requestMethods.POST, `connections/${receiverId}`, null);
            if (response.status !== 200) throw new Error('Failed to add connection');
            useDispatch(addConnectedUser(receiverId));
            console.log('Connection added:', response.data);
        } catch (error) {
            console.error('Error adding connection:', error);
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
            await addConnection();
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
        <>
            <View style={{ flex: 1, position: 'relative', backgroundColor: colors.bgDark }}>
                <GiftedChat
                    messages={messages}
                    onSend={(messages) => onSend(messages)}
                    user={{
                        _id: currentUser.id,
                        // avatar: null,
                    }}
                    renderBubble={renderBubble}
                    inverted={true}
                    renderSend={renderSend}
                    renderInputToolbar={() => {
                        return null;
                    }}
                    messagesContainerStyle={{ backgroundColor: '#1E1E1E', paddingTop: 8 }}
                    alignTop={true}
                    renderActions={() => null}
                />
                <View style={styles.chatModal}>
                    <ScrollView>

                    </ScrollView>
                </View>
            </View>
        </>
    );
};
export default Chat;

const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    chatModal: {
        backgroundColor: colors.bglight,
        height: height * 0.3,
        shadowColor: 'transparent',
        elevation: 0,
        bottom: 0,
        left: 0,
    },
});
