import React from 'react';
import { StyleSheet, Image, View, Text } from 'react-native';

import { colors, utilities } from '../../styles/utilities';

const LoadingScreen = ({ message = null }) => {
    return (
        <View style={[utilities.flexed, utilities.center, { backgroundColor: colors.bgDark }]}>
            <Image source={require('../../assets/appImages/logoS.png')} style={{ height: 80, width: 80 }} />
            {message && (
                <Text style={[utilities.textCenter, utilities.myFontMedium, { color: colors.offWhite , marginTop:12 }]}>
                    {message}
                </Text>
            )}
        </View>
    );
};

export default LoadingScreen;

const styles = StyleSheet.create({});
