import React, { useEffect, useLayoutEffect } from 'react';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from 'react-native';

import { setVenues } from '../store/Venues';
import { useSelector, useDispatch } from 'react-redux';

import { formatDateString, truncateText } from '../core/tools/formatDate';

import { ChevronLeft } from 'lucide-react-native';
import { colors, utilities } from '../styles/utilities';
import { profilePicturesUrl } from '../core/tools/apiRequest';
import { requestMethods, sendRequest } from '../core/tools/apiRequest';
import ModalHigh from '../components/Modals/ModalHigh';

const Venues = ({ navigation }) => {
    const dispatch = useDispatch();
    const venues = useSelector((global) => global.venuesSlice.venues);

    useEffect(() => {
        const getVenues = async () => {
            try {
                const response = await sendRequest(requestMethods.GET, 'users/type/venue', null);
                if (response.status !== 200) throw new Error('Failed to fetch venues');
                dispatch(setVenues(response.data));
            } catch (error) {
                console.log('Error fetching venues:', error);
            }
        };
        getVenues();
    }, []);

    const StreamCard = ({ entity, handleNavigation }) => {
        
        const { picture, about, name, location, venueType, band, date } = entity;
        const imageUrl = `${profilePicturesUrl + picture}`;

        return (
            <TouchableOpacity style={styles.cardContainer} onPress={handleNavigation}>
                <Image source={{ uri: imageUrl }} style={styles.backgroundImage} />
                <View style={styles.overlay}>
                    <View>
                        <Text style={[styles.streamName]}>{truncateText(name)}</Text>
                        <Text style={styles.date}>{date && formatDateString(date) || about}</Text>
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
    return (
        <ModalHigh
            title="Venues"
            navigation={navigation}
            items={venues}
            renderItem={({ item }) => (
                <StreamCard entity={item} handleNavigation={() => navigation.navigate('VenueDetails', { item })} />
            )}
        />
    );
};

export default Venues;

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
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
        justifyContent: 'space-between',
    },
    avatarsDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    streamName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    date: {
        fontSize: 16,
        color: 'white',
    },
});
