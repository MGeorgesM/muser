import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const DetailsPill = ({ label, items, handlePress }) => {
    const [selected, setSelected] = useState(false);

    const togglePill = () => {
        setSelected(!selected);
        handlePress(item);
    };

    return (
        <TouchableOpacity style={[styles.detailPill]} onPress={togglePill} >
            <Text style={styles.detail}>{}</Text>
        </TouchableOpacity>
    );
};

export default DetailsPill;

const styles = StyleSheet.create({
    detailPill: {
        borderRadius: 24,
        paddingVertical: 2,
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: !selected ? colors.primary : colors.lightGray,
    },

    detail: {
        color: !selected ? 'white' : 'black',
    },
});
