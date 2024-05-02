import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

import { utilities } from '../../styles/utilities';
import { defaultAvatar } from '../../core/tools/apiRequest';

const CommentCard = ({ userId, text }) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 8 }}>
            <Image source={defaultAvatar} style={styles.commentAvatar}></Image>
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
