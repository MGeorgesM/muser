import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

import { colors } from '../../styles/utilities';

const DetailsPill = ({ item, handlePress, isSelected }) => {
    console.log('item', item)
    return (
        <TouchableOpacity
            style={[styles.detailPill, { backgroundColor: isSelected ? colors.lightGray : 'transparent' }]}
            onPress={() => handlePress(item.id)}
        >
            <Text style={[styles.detail, { color: isSelected ? colors.black : 'white' }]}>{item.name ?? item.id}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    detailPill: {
        borderRadius: 24,
        paddingVertical: 2,
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: colors.lightGray,
        borderWidth: 0.25,
    },
    detail: {
        fontSize: 16,
    },
});

export default DetailsPill;
