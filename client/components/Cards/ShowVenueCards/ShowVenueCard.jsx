import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

import { profilePicturesUrl, showsPicturesUrl } from '../../../core/tools/apiRequest';
import { colors, utilities } from '../../../styles/utilities';
import { formatDateString } from '../../../core/tools/formatDate';

import { Radio } from 'lucide-react-native';

const ShowVenueCard = ({ entity, handlePress, isSelected = false }) => {
    const { picture, name, location, venueType, band, date } = entity;
    const imageUrl = band ? `${showsPicturesUrl + picture}` : `${profilePicturesUrl + picture}`;

    return (
        <TouchableOpacity style={styles.cardContainer} onPress={handlePress}>
            <Image source={{ uri: imageUrl }} style={styles.backgroundImage} />
            {isSelected && (
                <View style={styles.fullOverlay}>
                    <Radio size={48} color="white" onPress={() => handlePress(entity)} />
                    <Text style={styles.liveText}>Go Live</Text>
                </View>
            )}
            <View style={styles.overlay}>
                <View>
                    <Text style={[styles.entityName, { fontSize: band ? 18 : 20 }]}>{name || band.name}</Text>
                    <Text style={[styles.entityInfo, { fontSize: band ? 14 : 16 }]}>
                        {(date && formatDateString(date)) || `${venueType.name} - ${location.name}`}
                    </Text>
                </View>
            </View>
            {band && (
                <View style={styles.avatarsDisplay}>
                    {band.members.map((member) => (
                        <View key={member.id} style={styles.avatarContainer}>
                            <Image source={{ uri: profilePicturesUrl + member.picture }} style={styles.avatarImage} />
                            <View style={styles.avatarOverlay} />
                        </View>
                    ))}
                </View>
            )}
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
        borderRadius: utilities.borderRadius.s,
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
        height: 'auto',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        padding: 12,
        justifyContent: 'space-between',
    },
    avatarsDisplay: {
        position: 'absolute',
        right: 12,
        top: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        overflow: 'hidden',
        marginRight: 6,
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 16,
    },
    avatarOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    entityName: {
        color: 'white',
        fontFamily: 'Montserrat-Medium',
    },
    entityInfo: {
        color: 'white',
        fontFamily: 'Montserrat-Regular',
    },
    radioIconContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -24 }, { translateY: -24 }],
        zIndex: 10,
    },
    fullOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    liveText: {
        color: 'white',
        fontFamily: 'Montserrat-Medium',
        fontSize: 16,
    },
});
