import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

import { colors, utilities } from '../../styles/utilities';
import { profilePicturesUrl } from '../../core/tools/apiRequest';

import { Guitar } from 'lucide-react-native';

const FeedMemberCard = ({ user, height, navigation }) => {
    const imageUrl = `${profilePicturesUrl + user.picture}`;
    return (
        <TouchableOpacity
            style={[styles.cardContainer, { height: height || 180}]}
            onPress={() => navigation.navigate('ProfileDetails', { userId: user.id })}
        >
            <Image source={{ uri: imageUrl }} style={styles.photo} />
            <View style={styles.overlay}>
                <Text style={styles.username}>{user.name}</Text>
                <Guitar size={20} color="white" />
            </View>
        </TouchableOpacity>
    );
};

export default FeedMemberCard;

const styles = StyleSheet.create({
    cardContainer: {
        width: 170,
        borderRadius: utilities.borderRadius.m,
        overflow: 'hidden',
        margin: 4,

    },
    photo: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    overlay: {
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'space-between',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.blackTrsp,
        padding: 10,
    },
    username: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
});
