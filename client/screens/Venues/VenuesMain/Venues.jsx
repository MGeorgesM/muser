import React from 'react';
import ModalHigh from '../../../components/Modals/ModalHigh';
import ShowVenueCard from '../../../components/Cards/ShowVenueCards/ShowVenueCard';
import LoadingScreen from '../../../components/Misc/LoadingScreen/LoadingScreen';
import useVenuesLogic from './venuesLogic';

const Venues = ({ navigation }) => {
    const { venues, getVenues } = useVenuesLogic();

    return venues && venues.length > 0 ? (
        <ModalHigh
            title="Venues"
            items={venues}
            handleRefresh={getVenues}
            navigation={navigation}
            renderItem={({ item }) => (
                <ShowVenueCard
                    key={item.id}
                    entity={item}
                    handlePress={() => navigation.navigate('VenueDetails', { venue: item })}
                />
            )}
        />
    ) : (
        <LoadingScreen />
    );
};

export default Venues;
