import React from 'react';
import { View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { useChatLayoutLogic } from './chatLayoutLogic';
import { renderBubble, renderSend, renderInputToolbar, renderSystemMessage } from './chatLayoutConfig';

import { colors } from '../../styles/utilities';

import ChatModal from '../../components/Modals/ChatModal';
import useChatListenersLogic from './chatListenersLogic';
import useChatMessageLogic from './chatMessageLogic';
import useChatBandLogic from './chatBandLogic';

const Chat = ({ navigation, route }) => {
    const { id, chatTitle, currentUser, participants, chatProperties, setChatProperties } =
        useChatListenersLogic(route);
    const { modalsVisibility, setModalsVisibility } = useChatLayoutLogic(route, chatProperties);
    const { onSend } = useChatMessageLogic(route, chatProperties, setChatProperties);
    const { addParticipant, handleFormBand } = useChatBandLogic(
        route,
        onSend,
        chatProperties,
        setChatProperties,
        setModalsVisibility,
    );
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
