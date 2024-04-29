import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const FeedMemberCard = ({ user, height, navigation }) => {
    const imageUrl = `${profilePicturesUrl + user.picture}`;
    return (
        <TouchableOpacity
            style={[styles.cardContainer, { height: height || 180 }]}
            onPress={() => navigation.navigate('ProfileDetails', { user })}
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

const styles = StyleSheet.create({});
