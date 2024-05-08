import React, { useState, useLayoutEffect, useCallback, useEffect } from 'react';
import { TouchableOpacity, View, StyleSheet, Dimensions, Text, Pressable, TextInput } from 'react-native';

import { fireStoreDb } from '../config/firebase';
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    addDoc,
    serverTimestamp,
    doc,
    getDoc,
    setDoc,
    updateDoc,
} from 'firebase/firestore';

import { PlusIcon, ArrowLeft, Send as SendIcon, ChevronLeft, X, Check } from 'lucide-react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { renderBubble, renderSend, renderInputToolbar, renderComposer } from '../core/tools/chatConfigurations';

import { addConnectedUser } from '../store/Users';
import { useDispatch, useSelector } from 'react-redux';
import { useUser } from '../contexts/UserContext';

import { profilePicturesUrl } from '../core/tools/apiRequest';
import { sendRequest, requestMethods } from '../core/tools/apiRequest';
import { truncateText } from '../core/tools/formatDate';

import { colors, utilities } from '../styles/utilities';

import PictureHeader from '../components/PictureHeader/PictureHeader';
import ChatModal from '../components/Modals/ChatModal';

const Chat = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const { currentUser } = useUser();
    const userConnections = useSelector((global) => global.usersSlice.connectedUsers);

    const { id, chatParticipants, chatTitle } = route.params;

    const [chatMessages, setChatMessages] = useState([]);
    const [participants, setParticipants] = useState(chatParticipants);
    const [chatConnections, setChatConnections] = useState([]);

    const [connectionModalVisible, setConnectionModalVisible] = useState(false);
    const [bandModalVisible, setBandModalVisible] = useState(false);

    const [bandName, setBandName] = useState(chatTitle || '');

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => {
                if (chatTitle) return <Text style={[utilities.textL, utilities.myFontMedium]}>{chatTitle}</Text>;
                else {
                    const receiverName = chatParticipants.map((participant) => participant.name).join(', ');
                    const reciverPicture = chatParticipants[0].picture;
                    const receiverId = chatParticipants[0].id;

                    return (
                        <PictureHeader
                            picture={reciverPicture}
                            name={truncateText(receiverName)}
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
                <TouchableOpacity onPress={() => navigation.navigate('ChatMain')} style={{ marginLeft: 20 }}>
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
    }, [navigation, addParticipant, chatParticipants]);

    useEffect(() => {
        let unsubscribe;

        setChatMessages([]);

        const setupMessagesListener = async () => {
            const chatId = id || createChatId();

            console.log('Starting listener');
            console.log('Chat ID:', chatId);

            const newChatRef = doc(fireStoreDb, 'chats', chatId);
            const messagesRef = collection(newChatRef, 'messages');
            const q = query(messagesRef, orderBy('createdAt', 'desc'));

            unsubscribe = onSnapshot(q, (snapshot) => {
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
        getRemainingConnections();

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [id, chatParticipants]);

    const createChatId = () => [currentUser.id, chatParticipants[0].id].sort().join('-');

    const getRemainingConnections = async () => {
        console.log('Chat Participants:', chatParticipants);

        const remainingConnections = userConnections.filter((connection) =>
            chatParticipants.some((participant) => participant.id != connection.id)
        );

        setChatConnections(remainingConnections);
        
        console.log(
            'Remainign Connections:',
            remainingConnections.map((connection) => {
                return {
                    id: connection.id,
                    name: connection.name,
                    picture: connection.picture,
                };
            })
        );
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

    // getReceiverPicture = (userId) => {
    //     console.log('getting receivers pictures', userId);

    //     if (userId === currentUser.id) return null;

    //     if (receiver && receiver.length > 1) {
    //         let picture = null;
    //         const receiverUser = receiver?.find((user) => user.id === userId);
    //         if (receiverUser) {
    //             picture = `${profilePicturesUrl + receiverUser.picture}`;
    //             return picture;
    //         }
    //     }
    // };

    const addParticipant = async (newParticipantId) => {
        if (!newParticipantId && participants.includes(newParticipantId)) return;

        try {
            const chatRef = doc(fireStoreDb, 'chats', id);
            const newParticipantsList = [...participants, newParticipantId].sort();
            await updateDoc(chatRef, {
                participantsIds: newParticipantsList,
            });

            setParticipants([...participants, newParticipantId]);
            setConnectionModalVisible(false);
        } catch (error) {
            console.error('Error adding participant', error);
        }

        setConnectionModalVisible(false);
    };

    const addConnection = async () => {
        try {
            const response = await sendRequest(requestMethods.POST, `connections/${receiver.id}`, null);
            if (response.status !== 200) throw new Error('Failed to add connection');
            dispatch(addConnectedUser(receiver.id));
        } catch (error) {
            console.error('Error adding connection:', error);
        }
    };

    const createChat = async (initialMessage) => {
        try {
            const chatId = id || createChatId();

            const newChatRef = doc(fireStoreDb, 'chats', chatId);
            const messageRef = collection(newChatRef, 'messages');

            const participantsIds = participants.map((participant) => participant.id);

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
    };

    const onSend = useCallback(async (messages = []) => {
        setChatMessages((previousMessages) => GiftedChat.append(previousMessages, messages));

        console.log(chatMessages.length, messages.length);

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
                console.error('Error sending message:', error);
                setChatMessages((previousMessages) => previousMessages.slice(0, -messages.length));
            }
        }
    });

    const handleFormBand = async () => {
        if (bandName.length > 0) {
            console.log('forming band includes', participants);
            const chatRef = await getChat();
            if (chatRef) {
                const chatSnapshot = await getDoc(chatRef);
                if (!chatSnapshot.exists()) {
                    console.log('Chat document does not exist!');
                    return;
                }
                const chatData = chatSnapshot.data();
                const chatParticipantsIds = chatData.participantsIds;

                console.log('Using these participants IDs for forming the band:', chatParticipantsIds);
                try {
                    const response = await sendRequest(requestMethods.POST, `bands`, {
                        name: bandName,
                        members: chatParticipantsIds,
                    });
                    if (response.status !== 201) throw new Error('Failed to create band');

                    console.log('Band created:', response.data);

                    await updateDoc(chatRef, {
                        chatTitle: bandName,
                    });

                    const messageRef = collection(chatRef, 'messages');
                    const messageData = {
                        _id: `${currentUser.id}-${Date.now()}-${bandName}`,
                        text: `${currentUser.name} has formed the band ${bandName}!`,
                        createdAt: serverTimestamp(),
                        userId: currentUser.id,
                    };

                    const messageDocRef = await addDoc(messageRef, messageData);

                    await updateDoc(chatRef, {
                        lastMessage: {
                            messageId: messageDocRef.id,
                            text: messageData.text,
                            createdAt: serverTimestamp(),
                            userId: currentUser.id,
                        },
                    });
                } catch (error) {
                    console.error('Error processing band formation:', error);
                }
            } else {
                console.log('No chat reference available');
            }
        } else {
            console.log('Band name is required');
        }

        setBandModalVisible(false);
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.bgDark }}>
            <GiftedChat
                messages={chatMessages}
                onSend={(messages) => onSend(messages)}
                user={{
                    _id: currentUser.id,
                    // avatar: null,
                }}
                renderBubble={renderBubble}
                inverted={true}
                renderSend={renderSend}
                renderInputToolbar={renderInputToolbar}
                messagesContainerStyle={{ backgroundColor: colors.bgDark, paddingVertical: 8 }}
                alignTop={true}
                renderActions={() => null}
            />

            {bandModalVisible && (
                <View style={styles.chatModal}>
                    <Text style={[utilities.textL, utilities.myFontMedium, utilities.textCenter]}>Form Your Band</Text>
                    <View style={styles.bandInputContainer}>
                        <TextInput
                            style={[styles.formBandInput]}
                            placeholder="Your band name"
                            placeholderTextColor={colors.lightGray}
                            value={bandName}
                            onChangeText={(text) => setBandName(text)}
                        />
                        <Pressable onPress={handleFormBand} style={{ marginBottom: -8 }}>
                            {bandName?.length > 0 ? (
                                <Check size={32} color={colors.white} />
                            ) : (
                                <X size={24} color={colors.white} />
                            )}
                        </Pressable>
                    </View>
                </View>
            )}
            {connectionModalVisible && <ChatModal data={chatConnections} setModalVisible={setConnectionModalVisible} />}
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
