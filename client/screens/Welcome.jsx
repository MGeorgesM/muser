import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, StatusBar, SafeAreaView } from 'react-native';
import React from 'react';
import { colors, utilities } from '../styles/utilities';

const image = require('../assets/appImages/onboard0.jpg');

const Welcome = ({ navigation }) => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            {/* <StatusBar translucent hidden={true} /> */}
            <ImageBackground style={[styles.welcomeContainer]} source={image} resizeMode="cover">
                <View style={[utilities.photoOverlayS, {paddingHorizontal:20}]}>
                    <Text style={styles.welcomeText}>BE PART OF MUSER</Text>
                    <TouchableOpacity
                        style={[utilities.primaryBtn, { marginBottom: 96 }]}
                        onPress={() => navigation.navigate('Authentication')}
                    >
                        <Text style={[utilities.primaryBtnText, { color: colors.black }]}>Get Started</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
};

export default Welcome;

const styles = StyleSheet.create({
    welcomeContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },

    welcomeText: {
        color: 'white',
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 8,
        marginLeft: 8,
    },

});
