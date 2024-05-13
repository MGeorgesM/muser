import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground, StatusBar } from 'react-native';
import { utilities } from '../../styles/utilities';
import SystemNavigationBar from 'react-native-system-navigation-bar';

import PrimaryBtn from '../../components/Misc/PrimaryBtn/PrimaryBtn';

const imageUrl = require('../../assets/appImages/onboard.jpg');

const Welcome = ({ navigation }) => {
    useEffect(() => {
        const setNavigationBarColor = async (color) => {
            try {
                await SystemNavigationBar.setNavigationColor(color);
            } catch (error) {
                console.log('Error setting navigation bar color:', error);
            }
        };
        setNavigationBarColor('translucent');
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <StatusBar translucent hidden={true} />
            <ImageBackground
                style={[styles.welcomeContainer, styles.imageBackground]}
                source={imageUrl}
                resizeMode="cover"
            >
                <View style={[utilities.photoOverlayS, { paddingHorizontal: 20, justifyContent: 'flex-end' }]}>
                    <Text style={styles.welcomeText}>BE PART OF MUSER</Text>
                    <PrimaryBtn
                        text={'Get Started'}
                        handlePress={() => navigation.navigate('Authentication')}
                        marginBottom={96}
                    />
                </View>
            </ImageBackground>
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
        color: 'white',
        fontSize: 40,
        fontFamily: 'Montserrat-Bold',
        marginBottom: 8,
        marginLeft: 8,
    },
});
