import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ChevronLeft, CircleCheckBig } from 'lucide-react-native';

import { colors, utilities } from '../styles/utilities';

import { sendRequest, requestMethods } from '../core/tools/apiRequest';
import { generateHours, durations } from '../core/data/generateDatetime';

import ProfileDetailsPicker from '../components/ProfileDetailsPicker/ProfileDetailsPicker';
import VenueAvailabilityCard from '../components/Cards/VenueAvailabilityCard/VenueAvailabilityCard';
import PrimaryBtn from '../components/Elements/PrimaryBtn';

import { useDispatch } from 'react-redux';
import { addShow } from '../store/Shows';

const ShowDetails = ({ route, navigation }) => {
    const { venueId, venueName } = route.params;

    const [switchHandler, setSwitchHandler] = useState(false);
    const [validationError, setValidationError] = useState('');
    const [selectedCardId, setSelectedCardId] = useState(null);
    const [userBands, setUserBands] = useState([]);
    const [genres, setGenres] = useState([]);
    const [showBooking, setShowBooking] = useState({
        date: '',
        time: '',
        duration: '',
        band_id: 1,
        venue_id: venueId,
        picture: '',
        genre_id: '',
    });

    const hours = generateHours();
    const dispatch = useDispatch();

    useEffect(() => {
        const getUserBands = async () => {
            try {
                const response = await sendRequest(requestMethods.GET, 'bands/me', null);
                if (response.status !== 200) throw new Error('Failed to fetch user bands');
                setUserBands(response.data);
            } catch (error) {
                console.log('Error fetching user bands:', error);
            }
        };

        const getGenres = async () => {
            try {
                const response = await sendRequest(requestMethods.GET, 'genres', null);
                if (response.status !== 200) throw new Error('Failed to fetch genres');
                setGenres(response.data);
            } catch (error) {
                console.log('Error fetching genres:', error);
            }
        };

        getUserBands();
        getGenres();
    }, []);

    const validateForm = () => {
        setValidationError(null);

        // if (!selectedPicture) {
        //     setError('Please select a profile picture');
        //     return false;
        // }

        if (
            showBooking.date === '' ||
            showBooking.time === '' ||
            showBooking.duration === '' ||
            showBooking.band_id === '' ||
            showBooking.genre === ''
        ) {
            setValidationError('Please fill in all fields');
            return false;
        } else {
            setValidationError(null);
            return true;
        }
    };

    const handleSelectCard = (cardId) => {
        setSelectedCardId((prevSelectedCardId) => {
            if (prevSelectedCardId === cardId) {
                setShowBooking({
                    ...showBooking,
                    date: null,
                    time: null,
                });
                return null;
            } else {
                return cardId;
            }
        });
    };

    const handleCreateShow = async () => {
        setValidationError(null);
        const userInputValid = validateForm();
        if (!userInputValid) return;

        try {
            const response = await sendRequest(requestMethods.POST, 'shows', showBooking);
            if (response.status !== 201) throw new Error('Failed to create show');
            console.log('Show created:', response.data);
            dispatch(addShow(response.data));
            setSwitchHandler(true);
        } catch (error) {
            console.log('Error creating show:', error.message);
            setValidationError('Failed to create show');
        }
    };

    const handleProceed = () => {
        switchHandler ? navigation.goBack() : handleCreateShow();
    };

    if (userBands)
        return (
            <View style={[utilities.flexed, { backgroundColor: colors.bgDarkest }]}>
                {!switchHandler ? (
                    <View style={[utilities.flexed, styles.overviewContainer]}>
                        <View style={[utilities.flexRow, utilities.center, { marginBottom: 24 }]}>
                            <ChevronLeft
                                size={24}
                                color="white"
                                style={{ position: 'absolute', left: 0 }}
                                onPress={() => navigation.goBack()}
                            />
                            <Text style={[utilities.textL, utilities.myFontBold]}>{venueName}</Text>
                        </View>
                        <View style={{ marginBottom: 'auto', marginTop: 16 }}>
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
                                selectedValue={showBooking.genre_id}
                                onValueChange={(value) =>
                                    setShowBooking((prev) => ({
                                        ...prev,
                                        genre_id: value,
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
                        </View>
                        <View style={validationError ? {} : { marginBottom: 32 }}>
                            {showBooking.duration && (
                                <>
                                    <Text
                                        style={[
                                            utilities.textCenter,
                                            utilities.myFontBold,
                                            { fontSize: 18, marginBottom: 12 },
                                        ]}
                                    >
                                        Availability
                                    </Text>
                                    {[...Array(2)].map((_, index) => (
                                        <VenueAvailabilityCard
                                            key={index}
                                            duration={showBooking.duration}
                                            setShowBooking={setShowBooking}
                                            isSelected={selectedCardId === index}
                                            onSelect={() => handleSelectCard(index)}
                                        />
                                    ))}
                                </>
                            )}
                        </View>
                    </View>
                ) : (
                    <View style={[styles.overviewContainer, utilities.flexed, utilities.center, { gap: 16 }]}>
                        <CircleCheckBig size={64} color={colors.primary} />
                        <Text style={[utilities.textL, utilities.myFontMedium]}>Your Show is Confirmed!</Text>
                    </View>
                )}
                <View style={{ backgroundColor: colors.bgDark, paddingHorizontal: 20 }}>
                    {validationError && <Text style={[utilities.errorText]}>{validationError}</Text>}
                    <PrimaryBtn text={switchHandler ? 'Close' : 'Confirm'} handlePress={handleProceed} />
                </View>
            </View>
        );
};

export default ShowDetails;

const styles = StyleSheet.create({
    overviewContainer: {
        justifyContent: 'space-between',
        backgroundColor: colors.bgDark,
        marginTop: 64,
        paddingTop: 24,
        paddingHorizontal: 20,
        borderTopEndRadius: utilities.borderRadius.xl,
        borderTopLeftRadius: utilities.borderRadius.xl,
    },
});
