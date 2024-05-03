import React from 'react';
import { StyleSheet, Image, View, Text, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';

import { useUser } from '../contexts/UserContext';

import { utilities } from '../styles/utilities';

import BackBtn from '../components/Elements/BackBtn';

const logoImg = require('../assets/logowhite.png');
const imageSource = require('../assets/appImages/onboard3.jpg');
const { styles } = require('../components/AuthenticationForms/styles');

const UserRole = ({ navigation }) => {
    const { userInfo, setUserInfo } = useUser();

    return (
        <ImageBackground source={imageSource} style={{ flex: 1 }} resizeMode="cover">
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <BackBtn color="white" backgroundColor="transparent" />
                <View style={styles.topInnerContainer}>
                    <Image style={styles.welcomeLogo} source={logoImg} />
                    <Text style={styles.header}>What Brings You to Muser?</Text>
                    <View style={styles.userTypePrompt}>
                        <Text style={styles.userTypeText}>I'm a</Text>
                        <Picker
                            style={styles.userTypePicker}
                            selectedValue={userInfo.role_id}
                            onValueChange={(itemValue) => setUserInfo((prev) => ({ ...prev, role_id: itemValue }))}
                        >
                            <Picker.Item label="Musician" value="1" style={styles.pickerItem} />
                            <Picker.Item label="Venue" value="2" style={styles.pickerItem} />
                        </Picker>
                    </View>
                </View>
                <View style={styles.bottomInnerContainer}>
                    <TouchableOpacity style={[utilities.primaryBtn]}>
                        <Text style={[utilities.primaryBtnText]} onPress={() => navigation.navigate('UserInfo')}>
                            Continue
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </ImageBackground>
    );
};

export default UserRole;
