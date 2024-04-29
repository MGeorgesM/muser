import React from 'react';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from 'react-native';

import { ChevronLeft } from 'lucide-react-native';
import { colors, utilities } from '../styles/utilities';

import ModalHigh from '../components/Modals/ModalHigh';
import shows from '../core/tools/fakeShows';

const StreamsOverview = ({ navigation }) => {
    const StreamCard = ({ show }) => {
        return (
            <TouchableOpacity style={styles.cardContainer} onPress={navigation.navigate}>
                <Image source={show.imageUrl} style={styles.backgroundImage} />
                <View style={styles.overlay}>
                    <View>
                        <Text style={[styles.streamName]}>{show.name}</Text>

                        <Text style={styles.date}>{show.date}</Text>
                    </View>
                    <View style={styles.avatarsDisplay}>
                        {show.band.members.map((member) => (
                            <Image source={member.avatar} style={{ width: 32, height: 32, borderRadius: 16 }} />
                        ))}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };
    return (
        <ModalHigh
            title="Upcoming Shows"
            navigation={navigation}
            items={shows}
            renderItem={({ item }) => <StreamCard show={item} />}
        />
    );
};

export default StreamsOverview;

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
