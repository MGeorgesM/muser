import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { ChevronRight, Play } from 'lucide-react-native';

import { colors, utilities } from '../../styles/utilities';
import { formatDateString, truncateText } from '../../core/tools/formatDate';

const ShowCard = ({ entity, navigation, handlePress }) => {
    return (
        <TouchableOpacity style={styles.showCard} onPress={handlePress}>
            <View style={styles.showCardInner}>
                <View style={styles.showBtn}>
                    <Play size={16} color={colors.primary} />
                </View>
                <View style={styles.showDetails}>
                    <Text style={[utilities.textM, utilities.myFontMedium]}>{truncateText(entity.name, 25)}</Text>
                    {entity.data && (
                        <Text style={[utilities.textS, utilities.myFontRegular]}>{formatDateString(entity.date)}</Text>
                    )}
                </View>
            </View>
            <ChevronRight size={24} color={colors.white} />
        </TouchableOpacity>
    );
};

export default ShowCard;

const styles = StyleSheet.create({
    showCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 14,
        marginBottom: 6,
        height: 80,
        backgroundColor: colors.bglight,
        borderRadius: utilities.borderRadius.m,
    },

    showCardInner: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    showBtn: {
        width: 48,
        height: 48,
        borderRadius: utilities.borderRadius.s,
        backgroundColor: colors.bgDark,
        alignItems: 'center',
        justifyContent: 'center',
    },

    showDetails: {
        marginLeft: 12,
    },
});
