import React, { useState } from 'react';

import { useRegister } from '../contexts/RegisterContext';

import { Picker } from '@react-native-picker/picker';
import { StyleSheet, Platform, Image, View, Text, TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native';

const logoImg = require('../assets/logo.png');
const { styles } = require('../components/AuthenticationForms/styles');

const UserRole = ({ navigation }) => {
    const { userInfo, setUserInfo } = useRegister();

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.topInnerContainer}>
                    <Image style={styles.welcomeLogo} source={logoImg} />
                    <Text style={styles.header}>What Brings You to Muser?</Text>
                    <View style={userTypeStyles.userTypePrompt} >
                        <Text style={userTypeStyles.userTypeText}>I'm a</Text>
                        <Picker
                        style={userTypeStyles.userTypePicker}
                            selectedValue={userInfo.userType}
                            onValueChange={(itemValue) =>
                                setUserInfo((prev) => ({ ...prev, userType: itemValue }))
                            }
                            itemStyle={{ fontSize: 24 }}
                        >
                            <Picker.Item label="Musician" value="musician"/>
                            <Picker.Item label="Venue" value="venue" />
                        </Picker>
                    </View>
                </View>

                <View style={styles.bottomInnerContainer}>
                    <TouchableOpacity style={styles.primaryBtn}>
                        <Text style={styles.primaryBtnText} onPress={()=>navigation.navigate('UserInfo')}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const userTypeStyles = StyleSheet.create({
    userTypeText: {
        fontSize: 24,
        fontWeight: 'bold',
        alignSelf: 'center' // Align text vertically in the center
    },

    userTypePrompt: {
        flexDirection: 'row',
        justifyContent: 'center', // Center horizontally inside the view
        alignItems: 'center', // Align items vertically
        flex: 1 // Take available space
    },

    userTypePicker: {
        fontSize: 24,
        width: 200,
        alignSelf: 'center' // Align picker vertically in the center
    },
});

export default UserRole;
