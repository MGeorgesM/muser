import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';

import { ChevronLeft, CircleCheckBig } from 'lucide-react-native';

import { colors, utilities } from '../styles/utilities';

import { sendRequest, requestMethods } from '../core/tools/apiRequest';
import { generateHours, durations } from '../core/data/generateDatetime';

import ProfileDetailsPicker from '../components/ProfileDetailsPicker/ProfileDetailsPicker';
import VenueAvailabilityCard from '../components/VenueAvailabilityCard/VenueAvailabilityCard';
import PrimaryBtn from '../components/Elements/PrimaryBtn';

const ShowDetails = ({ route, navigation }) => {
    const [switchHandler, setSwitchHandler] = useState(false);
    const [userBands, setUserBands] = useState([]);
    const [genres, setGenres] = useState([]);
    const hours = generateHours();
    const [showBooking, setShowBooking] = useState({
        name: '',
        date: '',
        time: '',
        duration: '',
        band_id: '',
        venue_id: '',
        picture: '',
        genre: '',
    });
    // const { venue } = route.params;

    const title = 'VenueName';

    console.log('showbooking', showBooking);

    useEffect(() => {
        const getUserBands = async () => {
            try {
                const response = await sendRequest(requestMethods.GET, 'bands/me', null);
                if (response.status !== 200) throw new Error('Failed to fetch user bands');
                console.log(response.data);
                setUserBands(response.data);
            } catch (error) {
                console.log('Error fetching user bands:', error);
            }
        };

        const getGenres = async () => {
            try {
                const response = await sendRequest(requestMethods.GET, 'genres', null);
                if (response.status !== 200) throw new Error('Failed to fetch genres');
                console.log(response.data);
                setGenres(response.data);
            } catch (error) {
                console.log('Error fetching genres:', error);
            }
        };

        getUserBands();
        getGenres();
    }, []);

    const handleProceed = () => {
        // navigation.navigate('ShowConfirmation')
        try {
        } catch (error) {}
        setSwitchHandler(true);
    };

    if (userBands)
        return (
            <View style={styles.main}>
                <View style={[utilities.container, styles.overviewContainer]}>
                    <View style={[utilities.flexRow, utilities.center, { marginBottom: 24 }]}>
                        <ChevronLeft
                            size={24}
                            color="white"
                            style={{ position: 'absolute', left: 0 }}
                            onPress={() => navigation.goBack()}
                        />
                        <Text style={[utilities.textL, utilities.myFontBold]}>{title}</Text>
                    </View>
                    <View>
                        <ProfileDetailsPicker
                            items={userBands}
                            label={'Band'}
                            selectedValue={showBooking.band_id}
                            onValueChange={(value) =>
                                setShowBooking((prev) => ({
                                    ...prev,
                                    band_id: value,
                                }))
                            }
                        />
                        <ProfileDetailsPicker
                            items={genres}
                            label={'Main Genre'}
                            selectedValue={showBooking.genre}
                            onValueChange={(value) =>
                                setShowBooking((prev) => ({
                                    ...prev,
                                    genre: value,
                                }))
                            }
                        />
                        <ProfileDetailsPicker
                            items={hours}
                            label={'Show Time'}
                            selectedValue={showBooking.time}
                            onValueChange={(value) => setShowBooking((prev) => ({ ...prev, time: value }))}
                        />
                        <ProfileDetailsPicker
                            items={durations}
                            label={'Duration'}
                            selectedValue={showBooking.duration}
                            onValueChange={(value) => setShowBooking((prev) => ({ ...prev, duration: value }))}
                        />
                        <Text style={[utilities.textCenter, utilities.myFontBold, { fontSize: 18 }]}>Availability</Text>

                        {showBooking.duration &&
                            [...Array(3)].map((_, index) => (
                                <VenueAvailabilityCard
                                    key={index}
                                    duration={showBooking.duration}
                                    setShowBooking={setShowBooking}
                                />
                            ))}
                    </View>
                    <View style={styles.bottomInnerContainer}>
                        <Text style={[utilities.errorText]}>Hello</Text>
                        <PrimaryBtn text="Confrim" handlePress={handleProceed} />
                    </View>
                </View>
            </View>
        );
};

export default ShowDetails;

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: colors.bgDarkest,
    },
    overviewContainer: {
        marginTop: 64,
        backgroundColor: colors.bgDark,
        borderTopEndRadius: utilities.borderRadius.xl,
        borderTopLeftRadius: utilities.borderRadius.xl,
        paddingTop: 24,
        justifyContent: 'space-between',
    },
    showGenresContainer: {
        marginBottom: 20,
    },
});
