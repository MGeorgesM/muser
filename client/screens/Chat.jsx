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

import { PlusIcon, ArrowLeft, Send as SendIcon, ChevronLeft } from 'lucide-react-native';
import { GiftedChat, Bubble, Send, InputToolbar, Composer } from 'react-native-gifted-chat';
import { renderBubble, renderSend, renderInputToolbar } from '../core/tools/chatConfigurations';

import { addConnectedUser, setConnectedUsers } from '../store/Users';
import { useDispatch, useSelector } from 'react-redux';
import { useUser } from '../contexts/UserContext';

import { defaultAvatar } from '../core/tools/apiRequest';
import { sendRequest, requestMethods } from '../core/tools/apiRequest';

import PictureHeader from '../components/PictureHeader/PictureHeader';
import { colors, utilities } from '../styles/utilities';
import { FlatList, ScrollView, TextInput } from 'react-native-gesture-handler';
import BandMemberCard from '../components/BandMemberCard/BandMemberCard';

import { CircleCheckBig, CircleX } from 'lucide-react-native';

const Chat = ({ navigation, route }) => {
    const { currentUser } = useUser();
    const { chatId, chatParticipants } = route.params;

    const [messages, setMessages] = useState([]);
    const [participants, setParticipants] = useState(chatParticipants);
    // const [newParticipant, setNewParticipant] = useState(null);
    const [receiver, setReceiver] = useState(null);

    const userConnections = useSelector((global) => global.usersSlice.connectedUsers);
    const [connectionModalVisible, setConnectionModalVisible] = useState(false);
    const [bandModalVisible, setBandModalVisible] = useState(true);

    const [bandName, setBandName] = useState('');

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

    useLayoutEffect(() => {
        console.log('receiver', receiver);
        navigation.setOptions({
            headerTitle: () => {
                return <PictureHeader picture={receiver?.picture} name={receiver?.name} />;
            },
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.navigate('ChatMain')} style={{ marginLeft: 20 }}>
                    <ChevronLeft size={24} color="white" />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <View style={{ flexDirection: 'row', marginRight: 20, alignItems: 'center', gap: 8 }}>
                    <Pressable style={styles.bandBtn}>
                        <Text style={styles.bandBtnText}>Band</Text>
                    </Pressable>
                    <Pressable onPress={() => setConnectionModalVisible(true)}>
                        <PlusIcon size={24} color="white" />
                    </Pressable>
                </View>
            ),
            headerStyle: {
                backgroundColor: colors.bgDark,
                height: 128,
                shadowColor: 'transparent',
                elevation: 0,
                borderBottomWidth: 0.5,
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

    const addParticipant = async (newParticipantId) => {
        if (newParticipantId && !participants.includes(newParticipantId)) {
            const chatRef = await getChat();
            if (chatRef) {
                try {
                    const newParticipantsList = [...participants, newParticipantId].sort();
                    console.log('New participants:', newParticipantsList);
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

    const handleFormBand = async () => {
        if (bandName.length > 0) {
            const chatRef = await getChat();
            if (chatRef) {
                try {
                    await updateDoc(chatRef, {
                        bandName,
                    });
                    setBandModalVisible(false);
                } catch (error) {
                    console.error('Error adding band name:', error);
                }
            }
        }
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
                renderInputToolbar={() => {
                    if (connectionModalVisible || bandModalVisible) return null;
                    return renderInputToolbar();
                }}
                messagesContainerStyle={{ backgroundColor: colors.bgDark, paddingTop: 8 }}
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
                    <Text style={[utilities.textL, utilities.textCenter, { marginBottom: 16 }]}>Form Your Band</Text>
                    <View style={styles.bandInputContainer}>
                        <TextInput
                            style={[styles.formBandInput]}
                            placeholder="Band name"
                            placeholderTextColor="#ADADAD"
                            value={bandName}
                            onChangeText={(text) => setBandName(text)}
                        />
                        {
                            <Pressable onPress={handleFormBand}>
                                (bandName.length > 0 && <CircleCheckBig size={24} color={colors.white} />) || (
                                <CircleX size={24} color={colors.white} />)
                            </Pressable>
                        }
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
        height: height * 0.3,
        padding: 20,
        borderTopLeftRadius: utilities.borderRadius.xl,
        borderTopEndRadius: utilities.borderRadius.xl,
        backgroundColor: colors.bglight,
        shadowColor: 'transparent',
    },

    bandBtn: {
        backgroundColor: colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: utilities.borderRadius.m,
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },

    bandBtnText: {
        color: colors.black,
        fontSize: 16,
        fontWeight: 'bold',
    },

    bandInputContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        marginTop: 24,
    },

    formBandInput: {
        fontSize: 16,
        color: colors.white,
        height: 48,
        textAlign: 'center',
        // borderBottomColor: colors.white,
        // borderBottomWidth: 0.5,
    },
});
