import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { ChevronLeft } from 'lucide-react-native';
import { colors } from '../styles/utilities';

const BackBtn = ({ navigation }) => {
    return (
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <ChevronLeft style={styles.backBtnIcon} size={24} color={colors.primary} />
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
