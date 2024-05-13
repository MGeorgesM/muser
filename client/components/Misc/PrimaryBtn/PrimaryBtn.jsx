import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { utilities } from '../../../styles/utilities';

const PrimaryBtn = ({ text, handlePress, margin = 0, marginBottom = 24, marginTop = 0 }) => {
    return (
        <TouchableOpacity style={[utilities.primaryBtn, { margin, marginBottom, marginTop }]} onPress={handlePress}>
            <Text style={[utilities.primaryBtnText]}>{text}</Text>
        </TouchableOpacity>
    );
};

export default PrimaryBtn;

const styles = StyleSheet.create({});
