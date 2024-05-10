import React, {useEffect} from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { Image, View, Text, ScrollView, ImageBackground } from 'react-native';
import SystemNavigationBar from 'react-native-system-navigation-bar';

import { useUser } from '../contexts/UserContext';

import { colors, utilities } from '../styles/utilities';

import { ChevronDown } from 'lucide-react-native';

import PrimaryBtn from '../components/Elements/PrimaryBtn';

const logoImg = require('../assets/logowhite.png');
const imageSource = require('../assets/appImages/onboard00.jpg');
const { styles } = require('../components/AuthenticationForms/styles');

const UserRole = ({ navigation }) => {

    const { setUserInfo } = useUser();

    useEffect(() => {
        const showNavigationBar = async () => {
            try {
                await SystemNavigationBar.navigationShow();
                await SystemNavigationBar.setNavigationColor('translucent');
            } catch (error) {
                console.error('Failed to show system navigation bar:', error);
            }
        };
        showNavigationBar();
    }, []);

    return (
        <ImageBackground source={imageSource} style={{ flex: 1 }} resizeMode="cover">
            <View style={[utilities.photoOverlayL, utilities.container]}>
                {/* <BackBtn color="white" backgroundColor="transparent" navigation={navigation} /> */}
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
