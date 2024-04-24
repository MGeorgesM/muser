import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { utilities } from '../styles/utilities';

const StreamsOverview = () => {
    return (
        <View style={[utilities.container, styles.overviewContainer]}>
            <Text>StreamsOverview</Text>
        </View>
    );
};

export default StreamsOverview;

const styles = StyleSheet.create({
    overviewContainer: {
        backgroundColor: 'red'
    },
});
