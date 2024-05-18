import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

import { fireStoreDb } from '../../config/firebase';
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    addDoc,
    serverTimestamp,
    doc,
    setDoc,
    getDoc,
    updateDoc,
} from 'firebase/firestore';

import { GiftedChat } from 'react-native-gifted-chat';
import {
    renderBubble,
    renderSend,
    renderInputToolbar,
    useChatLayoutHeader,
    renderSystemMessage,
} from './chatLayoutConfig';

import { addNewConnection } from '../../store/Users';
import { useUser } from '../../core/data/contexts/UserContext';
import { useDispatch, useSelector } from 'react-redux';

import { profilePicturesUrl } from '../../core/tools/apiRequest';
import { sendRequest, requestMethods } from '../../core/tools/apiRequest';

import { colors } from '../../styles/utilities';

import ChatModal from '../../components/Modals/ChatModal';

const Chat = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const { currentUser } = useUser();
    const { id, participants, chatTitle, onBackPress } = route.params;

    const userConnections = useSelector((global) => global.usersSlice.connectedUsers);
    const feedUsers = useSelector((global) => global.usersSlice.feedUsers);

    const [chatProperties, setChatProperties] = useState({
        chatMessages: [],
        chatParticipants: [],
        chatConnections: [],
        localChatTitle: {
            bandName: '',
            participantsNames: '',
        },
    });

    const [modalsVisibility, setModalsVisibility] = useState({
        connectionModalVisible: false,
        bandModalVisible: false,
    });

    useChatLayoutHeader(id, chatTitle, participants, chatProperties, onBackPress, setModalsVisibility);

    useEffect(() => {
        let messagesUnsubscribe;
        let chatTitleUnsubscribe;
        let participantsUnsubscribe;

        setChatProperties({
            chatMessages: [],
            chatParticipants: [],
            localChatTitle: {
                bandName: '',
                participantsNames: '',
            },
        });

        const chatRef = doc(fireStoreDb, 'chats', id);

        const setupChatTitleListener = () => {
            if (chatTitle) {
                return;
            }

            chatTitleUnsubscribe = onSnapshot(chatRef, (doc) => {
                const chatData = doc.data();

                if (chatData?.chatTitle) {
                    setChatProperties((prev) => ({ ...prev, localChatTitle: { bandName: chatData.chatTitle } }));
                } else if (chatData?.participantsIds?.length > 1) {
                    const participantIds = chatData.participantsIds.filter((pid) => pid !== currentUser.id);
                    const participantNames = participantIds
                        .map((pid) => {
                            const user =
                                feedUsers.find((user) => user.id === pid) ||
                                userConnections.find((user) => user.id === pid);
                            return user ? user.name : null;
                        })
                        .filter((name) => name !== null);

                    if (participantNames.length > 1) {
                        setChatProperties((prev) => ({
                            ...prev,
                            localChatTitle: { participantsNames: participantNames.join(', ') },
                        }));
                    }
                }
            });
        };

        const setUpParticipantsListener = () => {
            participantsUnsubscribe = onSnapshot(chatRef, (doc) => {
                const chatData = doc.data();
                if (!chatData) return;

                const participantsIds = chatData.participantsIds;
                if (
                    participantsIds.length === chatProperties.chatParticipants.length + 1 ||
                    participantsIds.length === participants.length + 1
                ) {
                    return;
                }

                const participantsList = participantsIds
                    .filter((pid) => pid !== currentUser.id)
                    .map((pid) => {
                        const user =
                            feedUsers.find((user) => user.id === pid) ||
                            userConnections.find((user) => user.id === pid);
                        return user;
                    });

                setChatProperties((prev) => ({
                    ...prev,
                    chatParticipants: participantsList,
                    chatConnections: prev.chatConnections.filter((connection) =>
                        participantsList.every((participant) => participant.id !== connection.id)
                    ),
                }));
            });
        };

        const setupMessagesListener = () => {
            const messagesRef = collection(chatRef, 'messages');
            const q = query(messagesRef, orderBy('createdAt', 'desc'));

            messagesUnsubscribe = onSnapshot(q, (snapshot) => {
                const fetchedMessages = snapshot.docs.map((doc) => ({
                    _id: doc.id,
                    text: doc.data().text,
                    createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : new Date(),
                    system: doc.data().system,
                    user: {
                        _id: doc.data().userId,
                        avatar: getMessageAvatar(doc.data().userId),
                    },
                }));

                setChatProperties((prev) => ({ ...prev, chatMessages: fetchedMessages }));
            });
        };

        setupMessagesListener();
        setUpParticipantsListener();
        setupChatTitleListener();
        getRemainingConnections();

        return () => {
            chatTitleUnsubscribe && chatTitleUnsubscribe();
            messagesUnsubscribe && messagesUnsubscribe();
            participantsUnsubscribe && participantsUnsubscribe();
        };
    }, [id, participants]);

    const getRemainingConnections = async () => {
        if (!userConnections) return;

        const remainingConnections = userConnections.filter((connection) =>
            participants.every((participant) => participant.id !== connection.id)
        );

        setChatProperties((prev) => ({ ...prev, chatConnections: remainingConnections }));
    };

    const getMessageAvatar = (userId) => {
        if (participants && participants.length > 1 && userId !== currentUser.id) {
            const user = participants.find((user) => user.id === userId);
            if (user) {
                return `${profilePicturesUrl + user.picture}`;
            }
        }

        return null;
    };

    const addParticipant = async (newParticipant) => {
        const newParticipantId = newParticipant.id;

        if (newParticipantId && participants.some((participant) => participant.id === newParticipantId)) {
            return;
        }

        try {
            const chatRef = doc(fireStoreDb, 'chats', id);
            const chatDoc = await getDoc(chatRef);

            const newParticipantsList =
                chatProperties.chatParticipants.length > 0
                    ? [...chatProperties.chatParticipants, newParticipant]
                    : [...participants, newParticipant];

            const newParticipantsIdsList = newParticipantsList.map((participant) => participant.id);
            newParticipantsIdsList.push(currentUser.id);

            if (chatDoc.exists()) {
                setModalsVisibility((prev) => ({ ...prev, connectionModalVisible: false }));
                await updateDoc(chatRef, {
                    participantsIds: newParticipantsIdsList,
                });
            }

            const messageData = {
                _id: `${currentUser.id}-${Date.now()}`,
                text: `${newParticipant.name} has joined the chat!`,
                createdAt: serverTimestamp(),
                system: true,
            };

            onSend([messageData]);

            setChatProperties((prev) => ({
                ...prev,
                chatConnections: prev.chatConnections.filter((connection) => connection.id !== newParticipantId),
                chatParticipants: newParticipantsList,
            }));

            (chatTitle || chatProperties.localChatTitle.bandName) &&
                updateBandMembers(chatTitle || chatProperties.localChatTitle.bandName, newParticipantsIdsList);
        } catch (error) {
            console.log('Error adding participant', error);
        }
        setModalsVisibility((prev) => ({ ...prev, connectionModalVisible: false }));
    };

    const sendNotification = async (userIds, body, title = null) => {
        try {
            const response = await sendRequest(requestMethods.POST, `notifications`, {
                userIds,
                title,
                body,
            });

            if (response.status !== 200) throw new Error('Failed to send notification');
        } catch (error) {
            console.log('Error sending notification:', error);
        }
    };

    const getChatParticipantsAndNotify = async (body, title = null) => {
        const participantsSource =
            chatProperties.chatParticipants.length > 0 ? chatProperties.chatParticipants : participants;

        const participantsIds = participantsSource.map((participant) => participant.id);

        await sendNotification(participantsIds, body, title);
    };

    const addConnection = async () => {
        const newConnectionIds = participants.map((participant) => participant.id);
        try {
            const response = await sendRequest(requestMethods.POST, `connections`, {
                userIds: newConnectionIds,
            });

            if (response.status !== 200) throw new Error('Failed to add connections');
            response.data.connections.forEach((connection) => {
                dispatch(addNewConnection(connection.id));
            });
        } catch (error) {
            console.error('Error adding connections:', error);
        }
    };

    const createChat = async (initialMessage) => {
        try {
            const newChatRef = doc(fireStoreDb, 'chats', id);
            const messageRef = collection(newChatRef, 'messages');

            const participantsIds = participants.map((participant) => participant.id);
            participantsIds.push(currentUser.id);

            const messageDocRef = await addDoc(messageRef, {
                _id: initialMessage._id,
                text: initialMessage.text,
                createdAt: initialMessage.createdAt,
                userId: initialMessage.user._id,
            });

            await setDoc(newChatRef, {
                chatAdmin: currentUser.id,
                participantsIds: participantsIds,
                chatTitle: null,
                lastMessage: {
                    messageId: messageDocRef.id,
                    text: initialMessage.text,
                    createdAt: initialMessage.createdAt,
                    userId: initialMessage.user._id,
                },
                createdAt: serverTimestamp(),
            });
        } catch (error) {
            console.log('Error creating chat:', error);
        }

        getChatParticipantsAndNotify(initialMessage.text);
    };

    const onSend = useCallback(async (messages = []) => {
        setChatProperties((prev) => ({ ...prev, chatMessages: GiftedChat.append(prev.chatMessages, messages) }));

        if (chatProperties.chatMessages.length === 0) {
            try {
                const firstMessage = messages[0];
                await createChat(firstMessage);
                await addConnection();
            } catch (error) {
                console.error('Error sending first message:', error);
                setChatProperties((prev) => ({ ...prev, chatMessages: prev.chatMessages.slice(0, -1) }));
            }
        } else {
            try {
                const chatRef = doc(fireStoreDb, 'chats', id);
                const messagesRef = collection(chatRef, 'messages');

                messages.forEach(async (message) => {
                    const { _id, text, createdAt, user } = message;
                    const messageDocRef = await addDoc(messagesRef, {
                        _id,
                        text,
                        createdAt,
                        system: message.system || false,
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
            } catch (error) {
                console.log('Error sending message:', error);
                setChatProperties((prev) => ({ ...prev, chatMessages: prev.chatMessages.slice(0, -messages.length) }));
            }
        }
    });

    const updateBandMembers = async (bandName, membersIds) => {
        try {
            const response = await sendRequest(requestMethods.POST, 'bands', {
                name: bandName,
                members: membersIds,
            });
            if (response.status !== 200) throw new Error('Failed to update band members');
        } catch (error) {
            console.log('Error updating band members:', error);
        }
    };

    const handleFormBand = async (bandName) => {
        if (bandName.length === 0 || participants.length === 0) return;

        const participantsIds = participants.map((participant) => participant.id);
        participantsIds.push(currentUser.id);

        try {
            const response = await sendRequest(requestMethods.POST, `bands`, {
                name: bandName,
                members: participantsIds,
            });

            if (response.status !== 201) throw new Error('Failed to create band');

            setModalsVisibility((prev) => ({ ...prev, bandModalVisible: false }));

            const chatRef = doc(fireStoreDb, 'chats', id);
            await updateDoc(chatRef, {
                chatTitle: bandName,
            });

            setChatProperties((prev) => ({ ...prev, localChatTitle: { bandName } }));

            const messageData = {
                _id: `${currentUser.id}-${Date.now()}-${bandName}`,
                text: `We have formed the band \'${bandName}\'!`,
                createdAt: serverTimestamp(),
                user: {
                    _id: currentUser.id,
                    avatar: getMessageAvatar(currentUser.id),
                },
            };

            onSend([messageData]);
        } catch (error) {
            console.log('Error processing band formation:', error);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.bgDark }}>
            <GiftedChat
                messages={chatProperties.chatMessages}
                onSend={(messages) => onSend(messages)}
                user={{
                    _id: currentUser.id,
                    avatar: currentUser.picture,
                }}
                renderAvatarOnTop={true}
                onPressAvatar={(user) => {
                    navigation.navigate('Feed', {
                        screen: 'ProfileDetails',
                        params: {
                            userId: user._id,
                            onBackPress: () =>
                                navigation.navigate('ChatDetails', {
                                    id: id,
                                    participants: participants,
                                    chatTitle: chatTitle,
                                }),
                        },
                    });
                }}
                showUserAvatar={false}
                renderBubble={renderBubble}
                renderSend={renderSend}
                renderInputToolbar={renderInputToolbar}
                renderSystemMessage={renderSystemMessage}
                messagesContainerStyle={{ backgroundColor: colors.bgDark, paddingVertical: 8 }}
                alignTop={true}
            />
            {modalsVisibility.bandModalVisible && (
                <ChatModal
                    title={chatTitle || chatProperties.localChatTitle.bandName || 'Your Band Name'}
                    buttonText={chatTitle || chatProperties.localChatTitle.bandName ? null : 'Create Band'}
                    data={
                        chatTitle || chatProperties.localChatTitle.bandName
                            ? chatProperties.chatParticipants.length > 0
                                ? chatProperties.chatParticipants
                                : participants
                            : null
                    }
                    input={chatTitle || chatProperties.localChatTitle.bandName ? false : true}
                    handlePress={(!chatProperties.localChatTitle.bandName || !chatTitle) && handleFormBand}
                    setModalVisible={setModalsVisibility}
                />
            )}
            {modalsVisibility.connectionModalVisible && (
                <ChatModal
                    title={'Your Connections'}
                    buttonText="Add"
                    data={chatProperties.chatConnections}
                    setModalVisible={setModalsVisibility}
                    handlePress={addParticipant}
                />
            )}
        </View>
    );
};
export default Chat;
