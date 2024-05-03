import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

import { profilePicturesUrl } from '../../core/tools/apiRequest';

import { utilities } from '../../styles/utilities';

const PictureHeader = ({ name, picture, welcome = false }) => {
    if (name && picture)
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={{ uri: profilePicturesUrl + picture }} style={styles.avatar} />
                    <View style={styles.textContainer}>
                        {welcome && (
                            <Text style={[styles.welcomeDisplay, utilities.textM, utilities.noMb]}>Welcome</Text>
                        )}
                        <Text style={[utilities.textL, utilities.textBold, { marginTop: -4, color: 'white' }]}>
                            {name}
                        </Text>
                    </View>
                </View>
            </View>
        );
    return <Text>PictureHeader</Text>;
};

export default PictureHeader;

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 8,

        borderColor: 'white',
        borderWidth: 0.5,
    },
});
