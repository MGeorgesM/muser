import React, { useState } from 'react';
import { View } from 'react-native';

import { fireStoreDb } from '../../config/firebase';
import { serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';

import { GiftedChat } from 'react-native-gifted-chat';
import { useChatLayoutLogic } from './chatLayoutLogic';
import { renderBubble, renderSend, renderInputToolbar, renderSystemMessage } from './chatLayoutConfig';

import { useUser } from '../../core/data/contexts/UserContext';
import { sendRequest, requestMethods } from '../../core/tools/apiRequest';
import { colors } from '../../styles/utilities';

import ChatModal from '../../components/Modals/ChatModal';
import useChatListenersLogic from './chatListenersLogic';
import useChatMessageLogic from './chatMessageLogic';

const Chat = ({ navigation, route }) => {
    const { currentUser } = useUser();
    const { id, participants, chatTitle, onBackPress } = route.params;
    const { onSend } = useChatMessageLogic();

    const [chatProperties, setChatProperties] = useState({
        chatMessages: [],
        chatParticipants: [],
        chatConnections: [],
        localChatTitle: {
            bandName: '',
            participantsNames: '',
        },
    });

    const { modalsVisibility, setModalsVisibility } = useChatLayoutLogic(
        id,
        chatTitle,
        participants,
        chatProperties,
        onBackPress
    );
    useChatListenersLogic(id, chatTitle, participants, chatProperties, setChatProperties);

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
                    // avatar: getMessageAvatar(currentUser.id),
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
