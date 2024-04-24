import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity } from 'react-native';
import React from 'react';
const { height } = Dimensions.get('window');
const photo = require('../assets/girlimage.jpg');
import { colors, utilities } from '../styles/utilities';

const ProfileDetails = ({ route }) => {
    // const { username, photo } = route.params;

    return (
        <View style={styles.container}>
            <Image source={photo} style={styles.avatar} />
            <View style={[styles.detailContainer]}>
                <View>
                    <Text style={[utilities.textXL, utilities.textBold, {marginTop:12}]}>Johny Mouawad</Text>
                    <Text style={[utilities.textS, { color: colors.darkGray }]}>Keyboardist</Text>
                    <Text style={[utilities.textXS, { color: colors.gray }]}>Beirut, Lebanon</Text>
                </View>
                <View>
                    <Text style={[utilities.textS, utilities.textBold, styles.profileDetailsHeader]}>Bio</Text>
                    <Text style={[utilities.textM, { color: colors.darkGray }]}>
                        I am a keyboardist and I love to play music. I have been playing for 10 years now and I am
                        looking for a band to join.
                    </Text>
                    <Text style={[utilities.textS, utilities.textBold, styles.profileDetailsHeader]}>Details</Text>
                    <Text style={[utilities.textM, { color: colors.darkGray }]}>Skils and Details</Text>
                </View>
                <TouchableOpacity style={[utilities.secondaryBtn, { marginTop: 32 }]}>
                    <Text style={utilities.secondaryBtnText}>Say Hello!</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ProfileDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'visible',
    },
    avatar: {
        width: '100%',
        height: height * 0.6,
        resizeMode: 'cover',
    },
    detailContainer: {
        flex: 1,
        backgroundColor: 'white',
        height: height * 0.5,
        padding: 20,
        marginTop: -36,
        borderTopLeftRadius: utilities.borderRadius.xl,
        borderTopEndRadius: utilities.borderRadius.xl,
        elevation: 20,
        zIndex: 20,
    },
    username: {
        fontSize: 24,
    },

    profileDetailsHeader: {
        marginTop: 12,
        marginBottom: 0,
    },
});
