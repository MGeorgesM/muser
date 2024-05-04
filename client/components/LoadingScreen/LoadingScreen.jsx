import React from 'react';
import { StyleSheet, Image, View } from 'react-native';

import { colors, utilities } from '../../styles/utilities';

const LoadingScreen = () => {
    return (
        <View style={[utilities.flexed, utilities.center, { backgroundColor: colors.bgDark }]}>
            <Image
                source={require('../../assets/appImages/logoS.png')}
                style={{ height: 80, width: 80, marginBottom: 48 }}
            />
        </View>
    );
};

export default LoadingScreen;

const styles = StyleSheet.create({});
