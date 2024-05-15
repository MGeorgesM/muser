import React from 'react';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import { colors, utilities } from '../../styles/utilities';

import useProfileDetailsLogic from './profileDetailsLogic';
import BackBtn from '../../components/Misc/BackBtn/BackBtn';
import PrimaryBtn from '../../components/Misc/PrimaryBtn/PrimaryBtn';
import DetailsPill from '../../components/Misc/DetailsPill/DetailsPill';
import InstrumentIcon from '../../components/Misc/InstrumentIcon/InstrumentIcon';

const ProfileDetails = ({ route }) => {
    const { userId, onBackPress } = route.params;
    const { user, imageUrl, isConnected, handlePress, navigation } = useProfileDetailsLogic(userId);

    if (user.name)
        return (
            <View style={utilities.flexed}>
                <BackBtn navigation={navigation} onBackPress={onBackPress} backgroundColor={null} color="white" />
                <Image source={{ uri: imageUrl }} style={[styles.profileDetailsPicture]} />
                <View style={[styles.detailContainer]}>
                    <View
                        style={[utilities.flexRow, utilities.alignCenter, utilities.spaceBetween, { marginRight: 20 }]}
                    >
                        <View>
                            <Text style={[utilities.textXL, utilities.myFontBold, { marginTop: 12, marginBottom: -2 }]}>
                                {user.name}
                            </Text>
                            <Text style={[utilities.textS, utilities.myFontRegular, { color: colors.gray }]}>
                                {user.instrument.name}
                            </Text>
                            <Text
                                style={[utilities.textS, utilities.myFontRegular, { color: colors.gray }]}
                            >{`${user.location.name}, Lebanon`}</Text>
                        </View>
                        <View style={{ marginTop: 12 }}>
                            <InstrumentIcon instrument={user.instrument} />
                        </View>
                    </View>
                    <View>
                        <Text style={[utilities.textS, utilities.myFontRegular, styles.profileDetailsHeader]}>
                            About Me
                        </Text>
                        <Text style={[utilities.textS, utilities.myFontRegular, { color: colors.gray }]}>
                            {user.about}
                        </Text>
                        <Text style={[utilities.textS, utilities.myFontRegular, styles.profileDetailsHeader]}>
                            My Details
                        </Text>
                        <View style={[utilities.flexRow, utilities.flexWrap, { marginTop: 8, gap: 4 }]}>
                            <DetailsPill item={user?.instrument} />
                            <DetailsPill item={user?.experience} />
                            {user?.genres && user.genres.map((genre) => <DetailsPill key={genre.id} item={genre} />)}
                        </View>
                    </View>

                    <PrimaryBtn
                        text={isConnected ? 'Chat' : 'Say Hello!'}
                        marginTop={'auto'}
                        marginBottom={20}
                        handlePress={handlePress}
                    />
                </View>
            </View>
        );
};

export default ProfileDetails;

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
    profileDetailsPicture: {
        width: '100%',
        height: height * 0.6,
        resizeMode: 'cover',
    },
    detailContainer: {
        flex: 1,
        marginTop: -36,
        paddingTop: 16,
        paddingHorizontal: 20,
        height: height * 0.5,
        elevation: 1,
        backgroundColor: colors.bgDark,
        borderTopLeftRadius: utilities.borderRadius.xl,
        borderTopEndRadius: utilities.borderRadius.xl,
    },
    username: {
        fontSize: 24,
    },
    profileDetailsHeader: {
        marginTop: 12,
        marginBottom: 0,
    },
});
