import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

import { utilities } from '../../styles/utilities';
import { defaultAvatar, profilePicturesUrl } from '../../core/tools/apiRequest';

const CommentCard = ({ avatar, text }) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 8 }}>
            <Image source={{ uri: profilePicturesUrl + avatar }} style={styles.commentAvatar}></Image>
            <Text style={[utilities.textS]}>{text}</Text>
        </View>
    );
};

export default CommentCard;

const styles = StyleSheet.create({
    commentAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
    },
});
