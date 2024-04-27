import React, { useState } from 'react';

import { useUser } from '../contexts/UserContext';

import { Picker } from '@react-native-picker/picker';
import {
    Platform,
    Image,
    View,
    Text,
    TouchableOpacity,
    KeyboardAvoidingView,
    ScrollView,
} from 'react-native';

const logoImg = require('../assets/logo.png');
const { styles } = require('../components/AuthenticationForms/styles');

const UserRole = ({ navigation }) => {
    const { userInfo, setUserInfo } = useUser();

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.topInnerContainer}>
                    <Image style={styles.welcomeLogo} source={logoImg} />
                    <Text style={styles.header}>What Brings You to Muser?</Text>
                    <View style={styles.userTypePrompt}>
                        <Text style={styles.userTypeText}>I'm a</Text>
                        <Picker
                            style={styles.userTypePicker}
                            selectedValue={userInfo.userType}
                            onValueChange={(itemValue) => setUserInfo((prev) => ({ ...prev, userType: itemValue }))}
                            itemStyle={{ fontSize: 24 }}
                        >
                            <Picker.Item label="Musician" value="1" />
                            <Picker.Item label="Venue" value="2" />
                        </Picker>
                    </View>
                </View>

                <View style={styles.bottomInnerContainer}>
                    <TouchableOpacity style={styles.primaryBtn}>
                        <Text style={styles.primaryBtnText} onPress={() => navigation.navigate('UserInfo')}>
                            Continue
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default UserRole;
