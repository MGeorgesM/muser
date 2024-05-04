import React, { useState, useLayoutEffect, useCallback, useEffect } from 'react';
import { TouchableOpacity, Image, View, StyleSheet, Dimensions, Text, Pressable } from 'react-native';

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

import { PlusIcon, ArrowLeft, Send as SendIcon, ChevronLeft, X, Check } from 'lucide-react-native';
import { GiftedChat, Bubble, Send, InputToolbar, Composer } from 'react-native-gifted-chat';
import { renderBubble, renderSend, renderInputToolbar } from '../core/tools/chatConfigurations';

import { addConnectedUser, setConnectedUsers } from '../store/Users';
import { useDispatch, useSelector } from 'react-redux';
import { useUser } from '../contexts/UserContext';

import { profilePicturesUrl } from '../core/tools/apiRequest';
import { sendRequest, requestMethods } from '../core/tools/apiRequest';

import PictureHeader from '../components/PictureHeader/PictureHeader';
import { colors, utilities } from '../styles/utilities';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import BandMemberCard from '../components/BandMemberCard/BandMemberCard';

const Chat = ({ navigation, route }) => {
    const { currentUser } = useUser();
    const { chatId, chatParticipants, chatTitle } = route.params;

    const [localChatId, setLocalChatId] = useState(chatId);
    const [messages, setMessages] = useState([]);
    const [participants, setParticipants] = useState(chatParticipants);
    const [receiver, setReceiver] = useState(null);

    const userConnections = useSelector((global) => global.usersSlice.connectedUsers);
    const [connectionModalVisible, setConnectionModalVisible] = useState(false);
    const [bandModalVisible, setBandModalVisible] = useState(false);

    const [bandName, setBandName] = useState(chatTitle || '');

    const dispatch = useDispatch();

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
                const response = await sendRequest(requestMethods.GET, 'users/type/musician?connected=true', null);
                if (response.status !== 200) throw new Error('Failed to fetch connections');
                console.log('Connections fetched:', response.data);
                dispatch(setConnectedUsers(response.data));
            } catch (error) {
                console.log('Error fetching connections:', error);
            }
        };

        userConnections.length === 0 && getUserConnections();
        console.log('userConnections:', userConnections);
        getUsersPicutresandNames();
    }, [participants]);

    useEffect(() => {
        console.log('receiver', receiver);
        navigation.setOptions({
            headerTitle: () => {
                if (chatTitle) return <Text style={[utilities.textL, utilities.myFontMedium]}>{chatTitle}</Text>;
                else {
                    const receiverName = receiver?.map((user) => user.name).join(', ');
                    const reciverPicture = receiver?.map((user) => user.picture).join(', ');
                    return <PictureHeader picture={reciverPicture} name={receiverName} />;
                }
            },
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 20 }}>
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
    }, [navigation, addParticipant, receiver]);

    useLayoutEffect(() => {
        let unsubscribe;

        getReceiverPicture = (userId) => {
            console.log('getting receivers pictures', userId);

            if (userId === currentUser.id) return null;

            if (receiver && receiver.length > 1) {
                let picture = null;
                const receiverUser = receiver?.find((user) => user.id === userId);
                if (receiverUser) {
                    picture = `${profilePicturesUrl + receiverUser.picture}`;
                    return picture;
                }
            }
        };

        const setupMessagesListener = async () => {
            const chatRef = await getChat();
            if (!chatRef) return;

            const messagesRef = collection(chatRef, 'messages');
            const q = query(messagesRef, orderBy('createdAt', 'desc'));

            unsubscribe = onSnapshot(q, (snapshot) => {
                const fetchedMessages = snapshot.docs.map((doc) => ({
                    _id: doc.id,
                    text: doc.data().text,
                    createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : new Date(),
                    user: {
                        _id: doc.data().userId,
                        avatar: participants.length === 2 ? null : getReceiverPicture(doc.data().userId),
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
    }, [participants, chatId, localChatId]);

    const getChat = async () => {
        if (chatId) {
            const chatRef = doc(fireStoreDb, 'chats', chatId);
            return chatRef;
        } else {
            const chatRef = collection(fireStoreDb, 'chats');
            const q = query(chatRef, where('participantsIds', '==', participants));
            // const q = query(chatRef, where(`participantsIds.${participants[0]}`, '==', true));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) return querySnapshot.docs[0].ref;
        }
    };

    const addParticipant = async (newParticipantId) => {
        if (newParticipantId && !participants.includes(newParticipantId)) {
            const chatRef = await getChat();
            if (chatRef) {
                try {
                    const newParticipantsList = [...participants, newParticipantId].sort();
                    await updateDoc(chatRef, {
                        participantsIds: newParticipantsList,
                    });

                    setParticipants([...participants, newParticipantId]);
                    setConnectionModalVisible(false);
                } catch (error) {
                    console.error('Error adding participant', error);
                }
            }
        }
        setConnectionModalVisible(false);
    };

    const addConnection = async () => {
        const receiverId = participants.find((id) => id !== currentUser.id);
        try {
            const response = await sendRequest(requestMethods.POST, `connections/${receiverId}`, null);
            if (response.status !== 200) throw new Error('Failed to add connection');
            dispatch(addConnectedUser(receiverId));
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
            setLocalChatId(chatRef.id);
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

    const handleFormBand = async () => {
        if (bandName.length > 0) {
            const chatRef = await getChat();
            if (chatRef) {
                try {
                    const response = await sendRequest(requestMethods.POST, `bands`, {
                        name: bandName,
                        members: participants,
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
        if (connectionModalVisible || bandModalVisible) return null;

        return (
            <InputToolbar
                {...props}
                containerStyle={{
                    backgroundColor: '#1E1E1E',
                    padding: 6,
                    borderTopColor: '#fff',
                    borderTopWidth: 0.5,
                    borderBottomColor: '#fff',
                    borderBottomWidth: 0.5,
                }}
                renderComposer={renderComposer}
                primaryStyle={{ alignItems: 'center', justifyContent: 'center' }}
            />
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.bgDark }}>
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
                renderInputToolbar={renderInputToolbar}
                messagesContainerStyle={{ backgroundColor: colors.bgDark, paddingVertical: 8 }}
                alignTop={true}
                renderActions={() => null}
            />

            {connectionModalVisible && (
                <View style={styles.chatModal}>
                    <Text style={[utilities.textL, utilities.textCenter, { marginBottom: 16 }]}>Your Connections</Text>
                    <FlatList
                        data={userConnections}
                        renderItem={({ item }) => (
                            <BandMemberCard entity={item} handlePress={() => addParticipant(item.id)} />
                        )}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            )}
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
        color: colors.black,
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
