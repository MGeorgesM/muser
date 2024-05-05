import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { utilities } from '../../styles/utilities';

const AvailabilityCard = ({ duration }) => {
    const [randomDate, setRandomDate] = useState('');
    const [randomHour, setRandomHour] = useState('');
    const [endTime, setEndTime] = useState('');

    useEffect(() => {
        const dates = generateRandomDates(1);
        setRandomDate(dates[0].name);

        const hours = generateHours();
        const hourIndex = Math.floor(Math.random() * hours.length);
        const startHour = hours[hourIndex].name;
        setRandomHour(startHour);

        const startTime = parseInt(startHour.split(':')[0], 10);
        const calculatedEndTime = startTime + duration;
        const endHour = `${calculatedEndTime.toString().padStart(2, '0')}:00`;
        setEndTime(endHour);
    }, [duration]);

    return (
        <View style={styles.availabilityCard}>
            <Text style={[utilities.myFontMedium]}>{randomDate}</Text>
            <Text style={[utilities.myFontLight]}>
                {randomHour} - {endTime}
            </Text>
        </View>
    );
};

export default AvailabilityCard;

const styles = StyleSheet.create({
    availabilityCard: {
        backgroundColor: colors.bgDark,
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: utilities.borderRadius.l,
        marginBottom: 20,
        borderColor: colors.white,
        borderWidth: 0.5,
    },
});
