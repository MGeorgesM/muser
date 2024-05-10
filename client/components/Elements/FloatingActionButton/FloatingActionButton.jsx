import React from 'react';
import { StyleSheet, Text, View, Pressable, Icon } from 'react-native';

import { colors } from '../../../styles/utilities';

import { BrainCog } from 'lucide-react-native';

const FloatingActionButton = ({ text, icon: Icon, handlePress, bottom = 20 }) => {
    return (
        <Pressable style={[styles.fab, { bottom: bottom }]} onPress={handlePress}>
            {Icon ? <Icon size={24} color={colors.white} /> : <Text style={styles.fabText}>{text}</Text>}
        </Pressable>
    );
};

export default FloatingActionButton;

const styles = StyleSheet.create({
    fab: {
        width: 60,
        height: 60,
        borderRadius: 30,
        elevation: 10,
        backgroundColor: colors.primary,
        position: 'absolute',
        right: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },

    fabText: {
        color: 'white',
        fontFamily: 'Montserrat-Bold',
        fontSize: 20,
    },
});
