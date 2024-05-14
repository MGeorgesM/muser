import React, { useState, useLayoutEffect, useCallback, useEffect } from 'react';
import { TouchableOpacity, View, StyleSheet, Dimensions, Text, Pressable } from 'react-native';

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
    updateDoc,
} from 'firebase/firestore';

import { PlusIcon, ChevronLeft } from 'lucide-react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { renderBubble, renderSend, renderInputToolbar } from '../../core/tools/chatConfigurations';

import { addNewConnection } from '../../store/Users';
import { useUser } from '../../contexts/UserContext';
import { useDispatch, useSelector } from 'react-redux';

import { profilePicturesUrl } from '../../core/tools/apiRequest';
import { sendRequest, requestMethods } from '../../core/tools/apiRequest';
import { truncateText } from '../../core/tools/formatDate';

import { colors, utilities } from '../../styles/utilities';

import PictureHeader from '../../components/Misc/PictureHeader/PictureHeader';
import ChatModal from '../../components/Modals/ChatModal';

const Chat = ({ navigation, route }) => {
    const dispatch = useDispatch();

    const { currentUser } = useUser();

    const userConnections = useSelector((global) => global.usersSlice.connectedUsers);
    const feedUsers = useSelector((global) => global.usersSlice.feedUsers);

    const { id, participants, chatTitle, onBackPress } = route.params;

    const [chatMessages, setChatMessages] = useState([]);
    const [chatParticipants, setChatParticipants] = useState([]);
    const [chatConnections, setChatConnections] = useState([]);
    const [localChatTitle, setLocalChatTitle] = useState({
        bandName: '',
        participantsNames: '',
    });

    const [connectionModalVisible, setConnectionModalVisible] = useState(false);
    const [bandModalVisible, setBandModalVisible] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => {
                const title = chatTitle || localChatTitle.bandName || localChatTitle.participantsNames;

                if (title) return <Text style={[utilities.textL, utilities.myFontMedium]}>{title}</Text>;
                else {
                    if (!participants) return;

                    const participantsList = chatParticipants.length > 0 ? chatParticipants : participants;
                    const receiverName = participantsList.map((participant) => participant.name).join(', ');
                    const reciverPicture = participantsList[0].picture;
                    const receiverId = participantsList[0].id;

                    return (
                        <PictureHeader
                            picture={participantsList.length > 1 ? null : reciverPicture}
                            name={truncateText(receiverName, 20)}
                            handlePress={() =>
                                navigation.navigate('Feed', {
                                    screen: 'ProfileDetails',
                                    params: { userId: receiverId },
                                })
                            }
                        />
                    );
                }
            },
            headerLeft: () => (
                <TouchableOpacity
                    onPress={onBackPress || (() => navigation.navigate('ChatMain'))}
                    style={{ marginLeft: 20 }}
                >
                    <ChevronLeft size={24} color="white" />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <View style={{ flexDirection: 'row', marginRight: 20, alignItems: 'center', gap: 8 }}>
                    <Pressable style={styles.bandBtn} onPress={() => setBandModalVisible(true)}>
                        <Text style={styles.bandBtnText}>Band</Text>
                    </Pressable>
                    <Pressable onPress={() => setConnectionModalVisible(true)}>
                        <PlusIcon size={24} color="white" />
                    </Pressable>
                </View>
            ),
        });
    }, [id, participants, chatParticipants, localChatTitle, chatTitle]);

    useEffect(() => {
        let messagesUnsubscribe;
        let chatTitleUnsubscribe;
        let participantsUnsubscribe;

        setChatMessages([]);
        setChatParticipants([]);
        setLocalChatTitle({
            bandName: '',
            participantsNames: '',
        });

        const setupChatTitleListener = async () => {
            if (chatTitle) {
                return;
            }

            const chatRef = doc(fireStoreDb, 'chats', id);

            chatTitleUnsubscribe = onSnapshot(chatRef, (doc) => {
                const chatData = doc.data();

                if (chatData && chatData.chatTitle) {
                    setLocalChatTitle((prev) => ({ ...prev, bandName: chatData.chatTitle }));
                    return;
                }
                if (chatData && chatData.participantsIds && chatData.participantsIds.length > 1) {
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
                        setLocalChatTitle((prev) => ({ ...prev, participantsNames: participantNames.join(', ') }));
                    }
                }
            });
        };

        const setUpParticipantsListener = async () => {
            const chatRef = doc(fireStoreDb, 'chats', id);

            participantsUnsubscribe = onSnapshot(chatRef, (doc) => {
                const chatData = doc.data();

                if (!chatData) return;

                const participantsIds = chatData.participantsIds;

                console.log('currentuser', currentUser.name, currentUser.id);

                console.log('Participants Ids from Firebase:', participantsIds);
                console.log(
                    'Participants from State:',
                    chatParticipants.map((participant) => participant.id)
                );
                console.log(
                    'Participants from navigation:',
                    participants.map((participant) => participant.id)
                );

                console.log('lengths:', participantsIds.length, chatParticipants.length, participants.length);

                if (
                    participantsIds.length === chatParticipants.length + 1 ||
                    participantsIds.length === participants.length + 1
                )
                    return;

                console.log('Participants updating from firestore');

                const participantsList = participantsIds
                    .filter((pid) => pid !== currentUser.id)
                    .map((pid) => {
                        const user =
                            feedUsers.find((user) => user.id === pid) ||
                            userConnections.find((user) => user.id === pid);
                        return user;
                    });

                console.log('Participants List:', participantsList);

                setChatParticipants(participantsList);
            });
        };

        const setupMessagesListener = async () => {
            console.log('Starting listener');
            console.log('Chat ID:', id);
            console.log(
                'Chat Participants:',
                participants.map((participant) => participant.name)
            );

            const newChatRef = doc(fireStoreDb, 'chats', id);
            const messagesRef = collection(newChatRef, 'messages');
            const q = query(messagesRef, orderBy('createdAt', 'desc'));

            messagesUnsubscribe = onSnapshot(q, (snapshot) => {
                const fetchedMessages = snapshot.docs.map((doc) => ({
                    _id: doc.id,
                    text: doc.data().text,
                    createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : new Date(),
                    user: {
                        _id: doc.data().userId,
                        avatar: getMessageAvatar(doc.data().userId),
                    },
                }));

                setChatMessages(fetchedMessages);
            });
        };

        setupMessagesListener();
        setUpParticipantsListener();
        setupChatTitleListener();
        getRemainingConnections();

        return () => {
            if (chatTitleUnsubscribe && messagesUnsubscribe && participantsUnsubscribe) {
                chatTitleUnsubscribe();
                messagesUnsubscribe();
                participantsUnsubscribe();
            }
        };
    }, [id, participants]);

    const getRemainingConnections = async () => {
        if (!userConnections) return;

        const remainingConnections = userConnections.filter((connection) =>
            participants.every((participant) => participant.id !== connection.id)
        );

        setChatConnections(remainingConnections);
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
            console.log('Participant already exists in chat!');
            return;
        }

        try {
            const chatRef = doc(fireStoreDb, 'chats', id);

            // const newParticipantsList = [...participants, newParticipant];

            const newParticipantsList =
                chatParticipants.length > 0 ? [...chatParticipants, newParticipant] : [...participants, newParticipant];

            const newParticipantsIdsList = newParticipantsList.map((participant) => participant.id);
            newParticipantsIdsList.push(currentUser.id);

            await updateDoc(chatRef, {
                participantsIds: newParticipantsIdsList,
            });

            setChatParticipants(newParticipantsList);
            setConnectionModalVisible(false);
        } catch (error) {
            console.log('Error adding participant', error);
        }
        setConnectionModalVisible(false);
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
        const participantsSource = chatParticipants.length > 0 ? chatParticipants : participants;
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
        setChatMessages((previousMessages) => GiftedChat.append(previousMessages, messages));

        if (chatMessages.length === 0) {
            try {
                const firstMessage = messages[0];
                await createChat(firstMessage);
                await addConnection();
            } catch (error) {
                console.error('Error sending first message:', error);
                setChatMessages((previousMessages) => previousMessages.slice(0, -1));
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
                setChatMessages((previousMessages) => previousMessages.slice(0, -messages.length));
            }
        }
    });

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

            const chatRef = doc(fireStoreDb, 'chats', id);
            await updateDoc(chatRef, {
                chatTitle: bandName,
            });

            setLocalChatTitle((prev) => ({ ...prev, bandName }));
            setBandModalVisible(false);

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
                messages={chatMessages}
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
                messagesContainerStyle={{ backgroundColor: colors.bgDark, paddingVertical: 8 }}
                alignTop={true}
            />
            {bandModalVisible && (
                <ChatModal
                    title={chatTitle || localChatTitle.bandName || 'Your Band Name'}
                    buttonText={chatTitle || localChatTitle.bandName ? null : 'Create Band'}
                    data={
                        chatTitle || localChatTitle.bandName
                            ? chatParticipants.length > 0
                                ? chatParticipants
                                : participants
                            : null
                    }
                    input={chatTitle || localChatTitle.bandName ? false : true}
                    handlePress={(!localChatTitle.bandName || !chatTitle) && handleFormBand}
                    setModalVisible={setBandModalVisible}
                />
            )}
            {connectionModalVisible && (
                <ChatModal
                    title={'Your Connections'}
                    buttonText="Add"
                    data={chatConnections}
                    setModalVisible={setConnectionModalVisible}
                    handlePress={addParticipant}
                />
            )}
        </View>
    );
};
export default Chat;

const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    chatModal: {
        height: height * 0.2,
        paddingHorizontal: 20,
        paddingVertical: 24,
        justifyContent: 'space-between',
        borderTopLeftRadius: utilities.borderRadius.xl,
        borderTopEndRadius: utilities.borderRadius.xl,
        backgroundColor: colors.bglight,
    },

    bandBtn: {
        backgroundColor: colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderRadius: utilities.borderRadius.m,
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },

    bandBtnText: {
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
        marginBottom: 1,
        color: colors.white,
    },

    bandInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: colors.lightGray,
        borderBottomWidth: 0.5,
        marginBottom: 10,
    },

    formBandInput: {
        fontSize: 18,
        color: colors.white,
        height: 48,
        textAlign: 'left',
        width: '80%',
        marginBottom: -8,
    },

    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 8,

        borderColor: 'white',
        borderWidth: 0.5,
    },
});
