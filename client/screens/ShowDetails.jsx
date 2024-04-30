import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { ChevronLeft, CircleCheckBig } from 'lucide-react-native';

import { colors, utilities } from '../styles/utilities';
import ProfileDetailsPicker from '../components/ProfileDetailsPicker/ProfileDetailsPicker';

import hours from '../core/data/generateHours';

const ShowDetails = ({ route, navigation }) => {
    const [switchHandler, setSwitchHandler] = useState(false);
    // const { venue } = route.params;
    console.log(hours);

    const bands = [
        {
            id: 1,
            name: 'The Beatles',
        },
        {
            id: 2,
            name: 'The Rolling Stones',
        },
        {
            id: 3,
            name: 'The Who',
        },
        {
            id: 4,
            name: 'The Doors',
        },
    ];

    const durations = [
        {
            id: 1,
            name: '30 minutes',
        },
        {
            id: 2,
            name: '1 hour',
        },
        {
            id: 3,
            name: '1 hour 30 minutes',
        },
        {
            id: 4,
            name: '2 hours',
        },
        {
            id: 5,
            name: '2 hours 30 minutes',
        },
        {
            id: 6,
            name: '3 hours',
        },
        {
            id: 7,
            name: '> 3 hours',
        },
    ];

    const availabilities = [
        {
            id: 1,
        },
    ];

    const title = 'Paloma';

    const handleProceed = () => {
        // navigation.navigate('ShowConfirmation')
        try {
            
        } catch (error) {
            
        }
        setSwitchHandler(true);
    };

    return (
        <View style={styles.main}>
            <View style={[utilities.container, styles.overviewContainer]}>
                <View style={[utilities.flexRow, utilities.center, { marginBottom: 24 }]}>
                    <ChevronLeft
                        size={24}
                        color="black"
                        style={{ position: 'absolute', left: 0 }}
                        onPress={() => navigation.goBack()}
                    />
                    <Text style={[utilities.textL, utilities.textBold]}>{title}</Text>
                </View>
                <View>
                    <ProfileDetailsPicker items={bands} label={'Band'} />
                    <ProfileDetailsPicker items={hours} label={'Show Starts'} />
                    <ProfileDetailsPicker items={durations} label={'Duration'} />
                    <Text style={(utilities.textCenter, utilities.textBold, { fontSize: 18 })}>Availability</Text>
                </View>
                <TouchableOpacity style={[utilities.primaryBtn, { marginBottom: 20 }]} onPress={handleProceed}>
                    <Text style={[utilities.primaryBtnText]}>Confirm</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ShowDetails;

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
        justifyContent: 'space-between',
    },
});
