import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { ChevronLeft } from 'lucide-react-native';
import { colors } from '../../../styles/utilities';

const BackBtn = ({ navigation, onBackPress, color = colors.black, backgroundColor = colors.lightGrayTrsp }) => {
    return (
        <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: backgroundColor }]}
            onPress={onBackPress || (() => navigation.goBack())}
        >
            <ChevronLeft style={styles.backBtnIcon} size={24} color={color} />
        </TouchableOpacity>
    );
};

export default BackBtn;

const styles = StyleSheet.create({
    backBtn: {
        position: 'absolute',
        height: 36,
        width: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        top: 60,
        left: 20,
        zIndex: 1,
        backgroundColor: colors.lightGrayTrsp,
    },

    backBtnIcon: {
        marginLeft: -2,
    },
});
