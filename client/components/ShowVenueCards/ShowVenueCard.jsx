import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

import { profilePicturesUrl, showsPicturesUrl } from '../../core/tools/apiRequest';
import { utilities } from '../../styles/utilities';
import { formatDateString, truncateText } from '../../core/tools/formatDate';

const ShowVenueCard = ({ entity, handlePress }) => {
    const { picture, about, name, location, venueType, band, date } = entity;
    const imageUrl = band ? `${showsPicturesUrl + picture}` : `${profilePicturesUrl + picture}`;

    return (
        <TouchableOpacity style={styles.cardContainer} onPress={handlePress}>
            <Image source={{ uri: imageUrl }} style={styles.backgroundImage} />
            <View style={styles.overlay}>
                <View>
                    <Text style={[styles.streamName, {fontSize: band ? 18 : 20}]}>{truncateText(name)}</Text>
                    <Text style={[styles.date, {fontSize: band ? 14 : 16}]}>{(date && formatDateString(date)) || about}</Text>
                </View>
                {band && (
                    <View style={styles.avatarsDisplay}>
                        {band.members.map((member) => (
                            <Image
                                key={member.id}
                                source={{ uri: profilePicturesUrl + member.picture }}
                                style={{ width: 32, height: 32, borderRadius: 16 }}
                            />
                        ))}
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

export default ShowVenueCard;

const styles = StyleSheet.create({
    cardContainer: {
        width: '100%',
        height: 180,
        overflow: 'hidden',
        position: 'relative',
        borderRadius: utilities.borderRadius.m,
        marginBottom: 16,
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 16,
        justifyContent: 'space-between',
    },
    avatarsDisplay: {
        position: 'absolute',
        right: 20,
        bottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    streamName: {
        fontWeight: 'bold',
        color: 'white',
    },
    date: {
        color: 'white',
    },
});
