import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

import { useUser } from '../../../contexts/UserContext';
import { useSelector } from 'react-redux';

import { formatDate, truncateText } from '../../../core/tools/formatDate';
import { colors, utilities } from '../../../styles/utilities';

import { defaultAvatar } from '../../../core/tools/apiRequest';
import { profilePicturesUrl } from '../../../core/tools/apiRequest';
import { sendRequest, requestMethods } from '../../../core/tools/apiRequest';

const ChatCard = ({ chat, navigation }) => {
    const { currentUser } = useUser();

    const [participants, setParticipants] = useState(chat.participantsIds);
    const [title, setTitle] = useState(chat.chatTitle);
    const [avatar, setAvatar] = useState(null);

    const connectedUsers = useSelector((global) => global.usersSlice.connectedUsers);
    const feedUsers = useSelector((global) => global.usersSlice.feedUsers);

    useEffect(() => {
        chat && getUsersPicutresandNames();
        // if (!chat.chatTitle) {
        //     getUsersPicutresandNames();
        // } else {
        //     setTitle(chat.chatTitle);
        //     setAvatar(defaultAvatar);
        // }
    }, [chat]);

    const getUsersPicutresandNamesFromApi = async () => {
        console.log('Calling api');
        const otherParticipantIds = chat.participantsIds.filter((id) => id !== currentUser.id);
        if (otherParticipantIds.length === 0) return;

        const query = otherParticipantIds.map((id) => `ids[]=${id}`).join('&');

        try {
            const response = await sendRequest(requestMethods.GET, `users/details?${query}`, null);
            if (response.status !== 200) throw new Error('Failed to fetch users');

            setTitle(chat.chatTitle || response.data.map((user) => user.name).join(', '));
            setAvatar(chat.chatTitle ? defaultAvatar : `${profilePicturesUrl + response.data[0].picture}`);
            setParticipants(response.data);
        } catch (error) {
            console.log('Error fetching users:', error);
        }
    };

    const getUsersPicutresandNames = async () => {
        let otherParticipants = [];
        const otherParticipantIds = chat.participantsIds.filter((id) => id !== currentUser.id);

        for (const id of otherParticipantIds) {
            let user = connectedUsers.find((user) => user.id === id) || feedUsers.find((user) => user.id === id);
            if (!user) {
                console.log(`Fetching user info for ID: ${id} from API`);
                user = await getUserInfoFromApi(id);
            }
            if (user) {
                otherParticipants.push(user);
            }
        }

        if (otherParticipants.length > 0) {
            setTitle(chat.chatTitle || otherParticipants.map((user) => user.name).join(', '));
            setAvatar(chat.chatTitle ? defaultAvatar : `${profilePicturesUrl + otherParticipants[0].picture}`);
            setParticipants(otherParticipants);
        }
    };

    return (
        <TouchableOpacity
            style={styles.chatCardContainer}
            onPress={() =>
                navigation.navigate('ChatDetails', {
                    id: chat.id,
                    participants: participants,
                    chatTitle: chat.chatTitle,
                })
            }
        >
            <View style={[utilities.flexRow, utilities.center]}>
                {avatar && <Image source={{ uri: avatar }} style={styles.chatCardPhoto} />}
                <View>
                    <Text style={[utilities.textM, utilities.myFontMedium, { color: colors.white, marginBottom: 6 }]}>
                        {title && truncateText(title, 25)}
                    </Text>
                    <Text style={[utilities.textXS, utilities.myFontRegular, { color: colors.gray }]}>
                        {truncateText(chat.lastMessage.text, 35)}
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
        objectFit: 'cover',
    },
});
