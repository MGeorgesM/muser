import React, { useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, FlatList, Pressable } from 'react-native';

import { useUser } from '../../contexts/UserContext';

import { utilities, colors } from '../../styles/utilities';
import { formatDateString } from '../../core/tools/formatDate';
import { profilePicturesUrl, showsPicturesUrl, sendRequest, requestMethods } from '../../core/tools/apiRequest';

import { ChevronLeft } from 'lucide-react-native';

import PrimaryBtn from '../../components/Misc/PrimaryBtn/PrimaryBtn';
import ShowCard from '../../components/Cards/ShowCard/ShowCard';
import BandMemberCard from '../../components/Cards/BandMemberCard/BandMemberCard';
import LoadingScreen from '../../components/Misc/LoadingScreen/LoadingScreen';

const VenueDetails = ({ route, navigation }) => {
    const { venue, show, switchView } = route.params;

    const { currentUser } = useUser();

    const [switchHandler, setSwitchHandler] = useState(switchView ? true : false);
    const [shows, setShows] = useState([]);
    const [selectedShow, setSelectedShow] = useState(show);

    console.log('Selected Show:', selectedShow);
    console.log('Venue', venue);

    useLayoutEffect(() => {
        if (show) {
            setSelectedShow(show);
        }
    }, [show, switchView]);

    useEffect(() => {
        const getVenueShows = async () => {
            try {
                const response = await sendRequest(requestMethods.GET, `shows?venue_id=${venue.id}&status=set`, null);
                if (response.status !== 200) throw new Error('Failed to fetch venue shows');

                setShows(response.data);
            } catch (error) {
                console.log('Error fetching venue shows:', error);
            }
        };
        venue && getVenueShows();
    }, [venue]);

    const handleProceed = () => {
        switchView
            ? navigation.navigate('Live', {
                  screen: 'StreamBroadcast',
                  params: {
                      showId: show.id,
                      showName: `${show.band.name} @ ${show.venue.venue_name}`,
                  },
              })
            : navigation.navigate('ShowDetails', { venueId: venue.id, venueName: venue.venueName });
    };

    const handleBackBtn = () => {
        switchView ? navigation.navigate('Live', { screen: 'Streams' }) : setSwitchHandler(!switchHandler);
    };

    return shows && shows.length > 0 ? (
        <View style={[utilities.flexed, { backgroundColor: colors.bgDarkest }]}>
            {switchHandler && (
                <Pressable style={styles.backBtn} onPress={handleBackBtn}>
                    <ChevronLeft size={24} color={colors.white} style={styles.backBtnIcon} />
                </Pressable>
            )}
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
                        {switchHandler && (
                            <Text style={[utilities.myFontRegular, { color: colors.offWhite }]}>
                                {` - ${selectedShow.genre.name}`}
                            </Text>
                        )}
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
                        data={!switchHandler ? shows : selectedShow.band.members}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) =>
                            switchHandler ? (
                                <BandMemberCard
                                    entity={item}
                                    navigation={navigation}
                                    handlePress={() => {
                                        navigation.navigate('Feed', {
                                            screen: 'ProfileDetails',
                                            params: { userId: item.id },
                                        });
                                    }}
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
                        showsVerticalScrollIndicator={false}
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
    ) : (
        <LoadingScreen />
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
