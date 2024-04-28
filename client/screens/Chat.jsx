import React, { useState, useLayoutEffect, useCallback, useEffect } from 'react';
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

import { GiftedChat, Bubble, Send, InputToolbar, Composer } from 'react-native-gifted-chat';

import { PlusIcon, View, ArrowLeft, Send as SendIcon } from 'lucide-react-native';
import { useUser } from '../contexts/UserContext';
import { defaultAvatar } from '../core/tools/apiRequest';

import { sendRequest, requestMethods } from '../core/tools/apiRequest';

const Chat = ({ navigation, route }) => {
    const { currentUser } = useUser();
    const { receiverId, chatId, chatParticipants } = route.params;
    const [messages, setMessages] = useState([]);
    // const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [participants, setParticipants] = useState(
        chatParticipants?.length > 1 ? chatParticipants : [currentUser.id, receiverId].sort()
    );
    const [newParticipant, setNewParticipant] = useState(17);
    const [bandName, setBandName] = useState('The Jazzy Brazzy');

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
        console.log('chatparticipant in chat ', participants);
    }, []);

    useEffect(() => {

        const getUsersPicutresandNames = async () => {
            const otherParticipantIds = participants.filter((id) => id !== currentUser.id);

            if (otherParticipantIds.length === 0) return;

            const query = otherParticipantIds.map((id) => `ids[]=${id}`).join('&');

            try {
                const response = await sendRequest(requestMethods.GET, `users/details?${query}`, null);
                if (response.status !== 200) throw new Error('Failed to fetch users');
                console.log('Users fetched:', response.data);
            
            } catch (error) {
                console.log('Error fetching users:', error);
            }
        };

        getUsersPicutresandNames();


    })

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
    const addConnection = async () => {
        try {
            const response =  await sendRequest(requestMethods.POST, `connections/${receiverId}`, null );
            if (response.status !== 200) throw new Error('Failed to add connection');
            console.log('Connection added:', response.data);
        } catch (error) {
            console.error('Error adding connection:', error);
        }
    }

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

    function renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        // Background color for messages from the current user
                        backgroundColor: '#2E2E2E',
                        borderRadius: 12,
                        borderTopEndRadius: 0,
                    },
                    left: {
                        // Background color for messages from other users
                        backgroundColor: '#D9D9D9',
                        borderRadius: 12,
                        borderTopLeftRadius: 0,
                    },
                }}
                textStyle={{
                    right: {
                        color: '#fff', // Text color for messages from the current user
                    },
                    left: {
                        color: '#1E1E1E', // Text color for messages from other users
                    },
                }}
            />
        );
    }

    function renderSend(props) {
        return (
            <Send {...props} containerStyle={{
                borderTopWidth: 0,
                borderBottomWidth: 0,
                backgroundColor: 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
            }}
            >
                <TouchableOpacity
                    style={{
                        marginEnd: 8,
                        borderTopWidth: 0,
                        borderBottomWidth: 0,
                        backgroundColor: 'transparent',
                    }}
                >
                    <SendIcon size={24} color="#fff" />
                </TouchableOpacity>
            </Send>
        );
    }

    function renderComposer(props) {
        return (
            <Composer
                {...props}
                textInputStyle={{
                    color: '#fff',
                    marginEnd: 8,
                    borderTopWidth: 0,
                    borderBottomWidth: 0,
                    backgroundColor: 'transparent',
                }}
            />
        );
    }

    function renderInputToolbar(props) {
        return (
            <InputToolbar
                {...props}
                containerStyle={{
                    backgroundColor: '#1E1E1E', // Change the background color of the entire toolbar
                    padding: 6, // Apply padding to the toolbar
                    borderTopColor: '#fff',
                    borderTopWidth: 0.5,
                    borderBottomColor: '#fff',
                    borderBottomWidth: 0.5,
                }}
                renderComposer={renderComposer}
                primaryStyle={{ alignItems: 'center', justifyContent: 'center' }} // Style for the container of the input field
            />
        );
    }

    return (
        <GiftedChat
            messages={messages}
            onSend={(messages) => onSend(messages)}
            user={{
                _id: currentUser.id,
                // avatar: null,
            }}
            renderBubble={renderBubble}
            inverted={false}
            renderSend={renderSend}
            renderInputToolbar={renderInputToolbar}
            fdfas
            messagesContainerStyle={{ backgroundColor: '#1E1E1E', paddingTop: 8 }}
        />
    );
};
export default Chat;
