import React from 'react';
import { StyleSheet, Text, View, Pressable, Icon } from 'react-native';

import { colors } from '../../styles/utilities';

const FloatingActionButton = ({ text, icon, handlePress }) => {
    return (
        <Pressable style={styles.fab} onPress={handlePress}>
            {icon ? <Icon name={icon} size={24} color={colors.white} /> : <Text style={styles.fabText}>{text}</Text>}
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
        bottom: 20,
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
