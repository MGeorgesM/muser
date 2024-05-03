import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { utilities } from '../styles/utilities';


const Welcome = ({ navigation }) => {
    const handleProceed = () => {};

    return (
        <View style={[styles.welcomeContainer, utilities.container]}>
            <Text style={styles.welcomeText}>BE PART OF MUSER</Text>
            <TouchableOpacity
                style={[utilities.primaryBtn, { marginBottom: 96 }]}
                onPress={() => navigation.navigate('Authentication')}
            >
                <Text style={[utilities.primaryBtnText]}>Get Started</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Welcome;

const styles = StyleSheet.create({
    welcomeContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },

    welcomeText: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 8,
        marginLeft: 8,
    },
});
