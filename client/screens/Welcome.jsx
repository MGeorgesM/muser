import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground, StatusBar } from 'react-native';
import SystemNavigationBar from 'react-native-system-navigation-bar';

import { utilities } from '../styles/utilities';

import PrimaryBtn from '../components/Elements/PrimaryBtn';

const imageUrl = require('../assets/appImages/onboard00.jpg');
const Welcome = ({ navigation }) => {
    useEffect(() => {
        const hideNavigationBar = async () => {
            try {
                await SystemNavigationBar.navigationHide();
            } catch (error) {
                console.error('Failed to hide system navigation bar:', error);
            }
        };

        hideNavigationBar();
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
