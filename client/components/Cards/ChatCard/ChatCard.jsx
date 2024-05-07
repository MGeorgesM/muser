import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

import { useUser } from '../../../contexts/UserContext';

import { formatDate } from '../../../core/tools/formatDate';
import { colors, utilities } from '../../../styles/utilities';

import { defaultAvatar } from '../../../core/tools/apiRequest';
import { profilePicturesUrl } from '../../../core/tools/apiRequest';
import { sendRequest, requestMethods } from '../../../core/tools/apiRequest';

const ChatCard = ({ chat, navigation }) => {
    const [participants, setParticipants] = useState(chat.participantsIds);
    const [title, setTitle] = useState(chat.chatTitle);
    const [avatar, setAvatar] = useState(null);
    const { currentUser } = useUser();

    useEffect(() => {
        const getUsersPicutresandNames = async () => {
            const otherParticipantIds = chat.participantsIds.filter((id) => id !== currentUser.id);

            if (otherParticipantIds.length === 0) return;

            const query = otherParticipantIds.map((id) => `ids[]=${id}`).join('&');

            try {
                const response = await sendRequest(requestMethods.GET, `users/details?${query}`, null);
                if (response.status !== 200) throw new Error('Failed to fetch users');
                console.log('Users fetched:', response.data);
                console.log(`${profilePicturesUrl + response.data[0].picture}`);
                setTitle(response.data.map((user) => user.name).join(', '));
                setAvatar(`${profilePicturesUrl + response.data[0].picture}`);
            } catch (error) {
                console.log('Error fetching users:', error);
            }
        };

        if (!chat.chatTitle) {
            getUsersPicutresandNames();
        } else {
            setTitle(chat.chatTitle);
            setAvatar(defaultAvatar);
        }

        console.log('Chat card participants', participants);
    }, [chat]);

    return (
        <TouchableOpacity
            style={styles.chatCardContainer}
            onPress={() =>
                navigation.navigate('ChatDetails', {
                    id: chat.id,
                    chatParticipants: participants,
                    chatTitle: chat.chatTitle,
                })
            }
        >
            <View style={[utilities.flexRow, utilities.center]}>
                {avatar && <Image source={{ uri: avatar }} style={styles.chatCardPhoto} />}
                <View>
                    <Text style={[utilities.textM, utilities.myFontMedium, { color: colors.white, marginBottom: 6 }]}>
                        {title || 'Chat'}
                    </Text>
                    <Text style={[utilities.textXS, utilities.myFontRegular, { color: colors.gray }]}>
                        {chat.lastMessage.text}
                    </Text>
                </View>
            </View>
            <View>
                <Text style={[utilities.textXS, utilities.myFontRegular, { color: colors.gray }]}>
                    {formatDate(chat.lastMessage.createdAt)}
                </Text>
            </View>
        </TouchableOpacity>
    );
};
export default ChatCard;

const styles = StyleSheet.create({
    chatCardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,

        borderBottomColor: colors.darkGray,
        borderBottomWidth: 0.25,
    },
    chatCardPhoto: {
        width: 64,
        height: 64,
        borderRadius: 32,
        marginRight: 16,
    },
});
