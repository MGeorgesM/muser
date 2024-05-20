import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ChevronLeft, CircleCheckBig } from 'lucide-react-native';
import { colors, utilities } from '../../../styles/utilities';

import ProfileDetailsPicker from '../../../components/Misc/ProfileDetailsPicker/ProfileDetailsPicker';
import VenueAvailabilityCard from '../../../components/Cards/VenueAvailabilityCard/VenueAvailabilityCard';
import PrimaryBtn from '../../../components/Misc/PrimaryBtn/PrimaryBtn';
import useShowDetailsLogic from './showDetailsLogic';

const ShowDetails = ({ route, navigation }) => {
    const { venueId, venueName } = route.params;
    const {
        showBooking,
        pickerConfig,
        handleProceed,
        switchHandler,
        setShowBooking,
        selectedCardId,
        validationError,
        handleSelectCard,
    } = useShowDetailsLogic(venueId);

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
                        {pickerConfig.map(({ items, label, selectedValue, key }) => (
                            <ProfileDetailsPicker
                                key={key}
                                items={items}
                                label={label}
                                selectedValue={selectedValue}
                                onValueChange={(value) =>
                                    setShowBooking((prev) => ({
                                        ...prev,
                                        [key]: value,
                                    }))
                                }
                            />
                        ))}
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
