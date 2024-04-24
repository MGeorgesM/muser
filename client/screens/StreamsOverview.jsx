import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

import { utilities } from '../styles/utilities';

showImage = require('../assets/show.jpg');

const StreamsOverview = () => {
    const StreamCard = ({ streamName, date, imageUrl }) => {
        return (
            <View style={styles.cardContainer}>
                <Image source={imageUrl} style={styles.backgroundImage} />
                <View style={styles.overlay}>
                    <Text style={styles.streamName}>{streamName}</Text>
                    <Text style={styles.date}>{date}</Text>
                </View>
            </View>
        );
    };
    return (
        <View style={[utilities.container, styles.overviewContainer]}>
            <Text style={[utilities.textL, utilities.textBold, utilities.textCenter, { marginBottom: 36 }]}>Shows</Text>
            <StreamCard streamName={'The Jazzy Show'} date={'24/03/2024'} imageUrl={showImage} />
        </View>
    );
};

export default StreamsOverview;

const styles = StyleSheet.create({
    overviewContainer: {
        marginTop: 63,
        backgroundColor: '#dbdbdb',
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
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '33%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        justifyContent: 'center',
    },
    streamName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    date: {
        fontSize: 14,
        color: 'white',
    },
});
