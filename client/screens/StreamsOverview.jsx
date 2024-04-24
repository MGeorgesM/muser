import React from 'react';
import { StyleSheet, Text, View, Image, FlatList } from 'react-native';

import { ChevronLeft } from 'lucide-react-native';
import { colors, utilities } from '../styles/utilities';

import shows from '../core/tools/fakeShows';
const StreamsOverview = ({ navigation }) => {
    const StreamCard = ({ show }) => {
        return (
            <View style={styles.cardContainer}>
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
            </View>
        );
    };
    return (
        <View style={styles.main}>
            <View style={[utilities.container, styles.overviewContainer]}>
                <View style={[utilities.flexRow, utilities.center, { marginBottom: 24 }]}>
                    <ChevronLeft size={24} color="black" style={{ position: 'absolute', left: 0 }} 
                    onPress={() => navigation.goBack()}/>
                    <Text style={[utilities.textL, utilities.textBold]}>Shows</Text>
                </View>

                <FlatList
                    data={shows}
                    keyExtractor={(item) => item.name}
                    renderItem={({ item }) => <StreamCard show={item} />}
                ></FlatList>
            </View>
        </View>
    );
};

export default StreamsOverview;

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: colors.darkGray,
    },
    overviewContainer: {
        marginTop: 64,
        backgroundColor: 'white',
        borderTopEndRadius: utilities.borderRadius.xl,
        borderTopLeftRadius: utilities.borderRadius.xl,
        paddingTop: 24,
    },

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
