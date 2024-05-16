import React from 'react';
import ModalHigh from '../../components/Modals/ModalHigh';
import ShowVenueCard from '../../components/Cards/ShowVenueCards/ShowVenueCard';
import LoadingScreen from '../../components/Misc/LoadingScreen/LoadingScreen';
import useShowsLogic from './showsLogic';

const Shows = ({ navigation }) => {
    const { shows, getShows, handleCardPress } = useShowsLogic();
    return shows && shows.length > 0 ? (
        <ModalHigh
            title="Upcoming Shows"
            navigation={navigation}
            items={shows}
            renderItem={({ item }) => (
                <ShowVenueCard key={item.id} entity={item} handlePress={() => handleCardPress(item)} />
            )}
            handleRefresh={getShows}
        />
    ) : (
        <LoadingScreen />
    );
};

export default Shows;
