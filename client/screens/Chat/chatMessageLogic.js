import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { addNewConnection } from '../../core/data/store/Users';
import { fireStoreDb } from '../../config/firebase';
import { collection, addDoc, serverTimestamp, doc, setDoc, updateDoc } from 'firebase/firestore';
import { requestMethods, sendRequest, sendNotification } from '../../core/tools/apiRequest';
import { useUser } from '../../core/data/contexts/UserContext';
import { GiftedChat } from 'react-native-gifted-chat';

const useChatMessageLogic = (route, chatProperties, setChatProperties) => {
    const dispatch = useDispatch();
    const { currentUser } = useUser();
    const { id, participants } = route.params;

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
            
            getChatParticipantsAndNotify(initialMessage.text);
            
            await setDoc(newChatRef, {
                adminId: currentUser.id,
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
                    const { _id, text, createdAt, user, system } = message;
                    const messageDocRef = await addDoc(messagesRef, {
                        _id,
                        text,
                        createdAt,
                        system: system || false,
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
    return {
        sendNotification,
        onSend,
    };
};

export default useChatMessageLogic;
