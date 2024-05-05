import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { utilities, colors } from '../../styles/utilities';
import { generateRandomDates, generateHours } from '../../core/data/generateDatetime';

const VenueAvailabilityCard = ({ duration, setShowBooking, isSelected, onSelect }) => {
    const [randomDate, setRandomDate] = useState('');
    const [formattedDate, setFormattedDate] = useState('');
    const [randomHour, setRandomHour] = useState('');
    const [endTime, setEndTime] = useState('');

    useEffect(() => {
        const dates = generateRandomDates(1);
        const date = new Date(dates[0].name);
        setRandomDate(dates[0].name);
        setFormattedDate(
            date
                .toLocaleDateString('en-US', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                })
                .replace(/,/g, '')
        );

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
        <Pressable
            style={[
                styles.availabilityCard,
                utilities.justifyCenter,
                isSelected ? { backgroundColor: colors.white } : {},
            ]}
            onPress={() => {
                onSelect();
                setShowBooking((prev) => ({
                    ...prev,
                    date: randomDate,
                    time: randomHour,
                }));
            }}
        >
            <Text style={[utilities.myFontMedium, isSelected ? { color: colors.bgDarkest } : {}]}>{formattedDate}</Text>
            <Text style={[utilities.myFontLight, isSelected ? { color: colors.bgDarkest } : {}]}>
                {randomHour} - {endTime}
            </Text>
        </Pressable>
    );
};

export default VenueAvailabilityCard;

const styles = StyleSheet.create({
    availabilityCard: {
        height: 64,
        backgroundColor: colors.bgDark,
        paddingHorizontal: 24,
        borderRadius: utilities.borderRadius.m,
        marginBottom: 8,
        borderColor: colors.white,
        borderWidth: 0.5,
    },
});
