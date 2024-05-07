import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

import { colors, utilities } from '../../../styles/utilities';

import { ChevronRight } from 'lucide-react-native';

const SettingsCard = ({ iconComponent, text, onPress }) => {
    return (
        <TouchableOpacity style={styles.settingsCard} onPress={onPress}>
            <View style={styles.settingCardInner}>
                <View style={styles.settingsBtn}>{iconComponent}</View>
                <Text style={styles.settingsDetails}>{text}</Text>
            </View>
            <ChevronRight size={24} color={colors.white} />
        </TouchableOpacity>
    );
};

export default SettingsCard;

const styles = StyleSheet.create({
    settingsCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 14,
    },

    settingCardInner: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    settingsDetails: {
        marginLeft: 12,
        fontFamily: 'Montserrat-Medium',
        fontSize: 16,
    },

    settingsBtn: {
        width: 48,
        height: 48,
        borderRadius: utilities.borderRadius.s,
        backgroundColor: colors.bglight,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
