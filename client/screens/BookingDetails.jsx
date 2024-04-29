import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ChevronLeft } from 'lucide-react-native';

import { colors, utilities } from '../styles/utilities';
import EditProfilePicker from '../components/EditProfilePicker/EditProfilePicker';

import hours from '../core/data/generateHours';

const BookingDetails = ({ route, navigation }) => {
    // const { venue } = route.params;
    console.log(hours)

    const title = 'Paloma';
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
                    <EditProfilePicker items={hours} label={'Show Starts'} key={hours.id} />
                </View>
            </View>
        </View>
    );
};

export default BookingDetails;

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
});
