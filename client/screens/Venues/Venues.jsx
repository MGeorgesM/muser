import React, { useEffect } from 'react';

import { setVenues } from '../../store/Venues';
import { useSelector, useDispatch } from 'react-redux';

import { requestMethods, sendRequest } from '../../core/tools/apiRequest';

import ModalHigh from '../../components/Modals/ModalHigh';
import ShowVenueCard from '../../components/Cards/ShowVenueCards/ShowVenueCard';
import LoadingScreen from '../../components/Misc/LoadingScreen/LoadingScreen';

const Venues = ({ navigation }) => {
    const dispatch = useDispatch();
    const venues = useSelector((global) => global.venuesSlice.venues);

    useEffect(() => {
        const getVenues = async () => {
            try {
                const response = await sendRequest(requestMethods.GET, 'users/type/venue', null);
                if (response.status !== 200) throw new Error('Failed to fetch venues');
                console.log('Venues:', response.data.feedUsers);
                dispatch(setVenues(response.data.feedUsers));
            } catch (error) {
                console.log('Error fetching venues:', error);
            }
        };
        getVenues();
    }, []);

    return venues && venues.length > 0 ? (
        <ModalHigh
            title="Venues"
            navigation={navigation}
            items={venues}
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
