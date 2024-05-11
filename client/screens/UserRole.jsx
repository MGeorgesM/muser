import React from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { Image, View, Text, ImageBackground } from 'react-native';

import { useUser } from '../contexts/UserContext';

import { colors, utilities } from '../styles/utilities';

import { ChevronDown } from 'lucide-react-native';

import PrimaryBtn from '../components/Elements/PrimaryBtn';

const logoImg = require('../assets/appImages/logoOnboard.png');
const imageSource = require('../assets/appImages/onboard.jpg');

const { styles } = require('../components/AuthenticationForms/styles');

const UserRole = ({ navigation }) => {
    const { setUserInfo } = useUser();
    return (
        <ImageBackground source={imageSource} style={{ flex: 1 }} resizeMode="cover">
            <View style={[utilities.photoOverlayL, utilities.container]}>
                <View style={styles.topInnerContainer}>
                    <Image style={styles.welcomeLogo} source={logoImg} />
                    <Text style={styles.header}>What Brings You to Muser?</Text>
                    <View style={styles.userTypePrompt}>
                        <Text style={styles.userTypeText}>I'm a</Text>
                        <RNPickerSelect
                            value="1"
                            onValueChange={(value) => setUserInfo((prev) => ({ ...prev, role_id: value }))}
                            items={[
                                { label: 'Musician', value: '1', color: 'black' },
                                { label: 'Venue', value: '2', color: 'black' },
                            ]}
                            placeholder={{}}
                            style={{
                                inputAndroid: {
                                    fontSize: 28,
                                    fontFamily: 'Montserrat-Bold',
                                    color: colors.primary,
                                },
                                viewContainer: {
                                    flex: 1,
                                    paddingLeft: 10,
                                },
                            }}
                            useNativeAndroidPickerStyle={false}
                        />
                        <ChevronDown size={24} color="white" style={{ marginTop: 4, marginLeft: 6 }} />
                    </View>
                </View>

                <PrimaryBtn text={'Continue'} handlePress={() => navigation.navigate('UserInfo')} marginBottom={88} />
            </View>
        </ImageBackground>
    );
};

export default UserRole;
