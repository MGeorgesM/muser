import React from 'react';
import { useUser } from '../../../core/data/contexts/UserContext';
import { StyleSheet, Text, View, Image, Dimensions, FlatList } from 'react-native';
import { utilities, colors } from '../../../styles/utilities';
import { formatDateString } from '../../../core/tools/formatDate';
import { profilePicturesUrl, showsPicturesUrl } from '../../../core/tools/apiRequest';

import PrimaryBtn from '../../../components/Misc/PrimaryBtn/PrimaryBtn';
import ShowCard from '../../../components/Cards/ShowCard/ShowCard';
import BandMemberCard from '../../../components/Cards/BandMemberCard/BandMemberCard';
import BackBtn from '../../../components/Misc/BackBtn/BackBtn';
import useVenueDetailsLogic from './venueDetailsLogic';

const VenueDetails = ({ route, navigation }) => {
    const { venue, show, switchView } = route.params;
    const { currentUser } = useUser();
    const {
        shows,
        selectedShow,
        switchHandler,
        handleProceed,
        handleBackBtn,
        setSelectedShow,
        setSwitchHandler,
        handleMemberCardPress,
    } = useVenueDetailsLogic(show, venue, switchView);
    return (
        <View style={[utilities.flexed, { backgroundColor: colors.bgDarkest }]}>
            {switchHandler && <BackBtn onBackPress={handleBackBtn} />}
            <View>
                <Image
                    source={{
                        uri: switchHandler
                            ? `${showsPicturesUrl + selectedShow?.picture}`
                            : `${profilePicturesUrl + venue?.picture}`,
                    }}
                    style={[styles.entityImage, styles.borderRadiusBottom]}
                />
                <View style={[utilities.overlay, styles.borderRadiusBottom, { height: 96, gap: 2 }]}>
                    <Text style={[utilities.textL, utilities.myFontBold, { color: 'white' }]}>
                        {!switchHandler ? venue?.venueName : selectedShow?.band.name}
                    </Text>
                    <Text style={[utilities.textS, utilities.myFontRegular, { color: colors.offWhite }]}>
                        {switchHandler ? formatDateString(selectedShow.date) : `${venue?.location.name}, Lebanon`}
                    </Text>
                </View>
            </View>
            <View style={[utilities.container]}>
                <Text style={[utilities.textM, utilities.myFontBold, { marginVertical: 18 }]}>
                    {!switchHandler ? 'Upcoming Shows' : 'Band Members'}
                </Text>
                {shows.length > 0 || switchHandler ? (
                    <FlatList
                        style={{ marginBottom: 4 }}
                        showsVerticalScrollIndicator={false}
                        data={!switchHandler ? shows : selectedShow.band.members}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) =>
                            switchHandler ? (
                                <BandMemberCard
                                    entity={item}
                                    navigation={navigation}
                                    handlePress={() => handleMemberCardPress(item.id)}
                                />
                            ) : (
                                <ShowCard
                                    entity={item}
                                    navigation={navigation}
                                    handlePress={() => {
                                        setSelectedShow(item);
                                        setSwitchHandler(true);
                                    }}
                                />
                            )
                        }
                    />
                ) : (
                    <Text style={[utilities.textM, utilities.myFontRegular, { color: colors.offWhite }]}>
                        No shows available, check back later!
                    </Text>
                )}
                {(currentUser?.role.id === 1 || switchView) && (
                    <PrimaryBtn
                        text={switchView ? 'Go Live' : 'Book your Show'}
                        marginTop={'auto'}
                        handlePress={handleProceed}
                    />
                )}
            </View>
        </View>
    );
};

export default VenueDetails;

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
    borderRadiusBottom: {
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    entityImage: {
        width: '100%',
        height: height * 0.49,
        resizeMode: 'cover',
        position: 'relative',
    },

    backBtn: {
        position: 'absolute',
        height: 36,
        width: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        top: 60,
        left: 20,
        zIndex: 1,
    },
    backBtnIcon: {
        marginLeft: -2,
    },
});
