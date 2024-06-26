import React from 'react';
import { StyleSheet, Text, View, ImageBackground, StatusBar } from 'react-native';
import { utilities } from '../../../styles/utilities';
import { useNavigationBarColor } from '../../../core/tools/systemNavigationBar';

import PrimaryBtn from '../../../components/Misc/PrimaryBtn/PrimaryBtn';

const imageUrl = require('../../../assets/appImages/onboardE.jpg');

const Welcome = ({ navigation }) => {

    useNavigationBarColor('translucent')

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
