import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';

const CommentCard = () => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 8 }}>
            <Image source={defaultAvatar} style={styles.commentAvatar}></Image>
            <Text style={[utilities.textS]}>This is a user comment on the live stream</Text>
        </View>
    );
};

export default CommentCard;

const styles = StyleSheet.create({});
